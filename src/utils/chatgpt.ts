import axios from "axios";
import { randomUUID } from "crypto";
import AskResponse from "src/models/ask-response.js";
import Result from "src/models/result.js";
import ErrorType from "../enums/error-type.js";
import isObject from "./is-object.js";
import processError from "../utils/process-error.js";
import SessionResponse from "../models/session-response.js";

/**
 * 將緩衝區分割為字串行。
 * @param chunks 緩衝區。
 * @returns 一個陣列，每個元素都是已處理過的字串行。
 */
async function chunksToLines(chunks) {
  let previous = "";
  const lines = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    previous += bufferChunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf("\n")) >= 0) {
      // 行包含 EOL
      const line = previous.slice(0, eolIndex + 1).trimEnd();
      if (line === "data: [DONE]") break;
      if (line.startsWith("data: ")) lines.push(line);
      previous = previous.slice(eolIndex + 1);
    }
  }
  return lines;
}

/**
 * 將字串行轉換為訊息。
 * @param lines 字串行的陣列。
 * @returns 一個陣列，每個元素都是已處理過的訊息。
 */
async function linesToMessages(lines) {
  const messages = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const message = line.substring("data :".length);
    messages.push(message);
  }
  return messages;
}

/**
 * 在串流結束時傳回所有已取得的字串行。
 * @param data 原始接收到的資料串流。
 * @returns 一個陣列，每個元素都是已獲取的訊息。
 */
async function streamCompletion(data) {
  const chunks = [];
  for await (const chunk of data) {
    chunks.push(chunk);
  }
  const lines = await chunksToLines(chunks);
  const messages = await linesToMessages(lines);
  return messages;
}

/**
 * 向對話機器人發送訊息。
 * @param callback 在訊息發送後調用的回調函數，以處理對話機器人傳回的訊息。
 * @param bypassNode 對話機器人的 URL 位址。
 * @param accessToken 存取對話機器人所需的存取金鑰。
 * @param model 使用的模型。
 * @param prompt 要送到對話機器人的提示。
 * @param parentMessageId 父訊息的 ID。
 * @param conversationId 對話 ID（可選）。
 * @returns 包含從對話機器人接收到的回答的 `Result` 物件。
 */
async function sendMessage(callback, bypassNode, accessToken, model, prompt, parentMessageId, conversationId) {
  let data = {
    action: "next",
    messages: [
      {
        id: randomUUID(),
        role: "user",
        content: {
          content_type: "text",
          parts: [prompt],
        },
      },
    ],
    conversation_id: conversationId,
    parent_message_id: parentMessageId,
    model: model,
  };

  if (!conversationId) delete data.conversation_id;

  let result = {
    data: {
      answer: "",
      conversationId: "",
      messageId: "",
    },
    error: "",
    errorType: ErrorType.UnknownError,
    status: true,
  };

  try {
    let response = await axios.post(`${bypassNode}/backend-api/conversation`, data, {
      responseType: "stream",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    let dataToReturn;

    if (response.headers["content-type"] === "application/json") {
        let dataChunks = "";
        response.data.on("data", (chunk) => {
          dataChunks += chunk.toString();
        });
        response.data.on("end", () => {
          let responseData = JSON.parse(dataChunks);
  
          if (responseData.status === "ok") {
            result.data.answer = responseData.answers[0].message;
            result.data.conversationId = responseData.conversation_id;
            result.data.messageId = responseData.answers[0].id;
          } else {
            result.errorType = ErrorType.ServerError;
            result.error = responseData.error_message;
            result.status = false;
            return new Result(result);
          }
        });
      } else {
        dataToReturn = await streamCompletion(response.data);
  
        for (let i = 0; i < dataToReturn.length; i++) {
          const message = dataToReturn[i];
          let responseObj;
          try {
            responseObj = JSON.parse(message);
          } catch (e) {
            continue;
          }
  
          if (!isObject(responseObj)) {
            continue;
          }
  
          if (responseObj.type === "message" && responseObj.message.role === "bot") {
            let askResponse = new AskResponse();
            askResponse.id = responseObj.message.id;
            askResponse.message = responseObj.message.content.body;
            callback(askResponse);
          } else if (responseObj.type === "message" && responseObj.message.role === "user") {
            continue;
          } else if (responseObj.type === "error") {
            processError(responseObj, result);
            break;
          }
        }
      }
  
      return new Result(result);
    } catch (error) {
      processError(error, result);
      return new Result(result);
    }
  }
  
  /**
   * 驗證 JWT token 的有效性。
   * @param token 要驗證的 JWT token 字串。
   * @returns 如果 token 有效，則傳回 true；否則傳回 false。
   */
  function validateToken(token) {
    try {
      const [, payload] = token.split(".");
      const { exp } = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
      if (exp < Date.now() / 1000) return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * 獲取存取金鑰和對話金鑰。
   * @param bypassNode 對話機器人的 URL 位址。
   * @param sessionToken 對話金鑰。
   * @returns 包含 auth、expires 和 sessionToken 屬性的 `Result` 物件。
   */
  async function getTokens(bypassNode, sessionToken) {
    let urlParams = new URLSearchParams({
      session_token: sessionToken,
    });
  
    let response = await axios.post(`${bypassNode}/backend-api/tokens?${urlParams.toString()}`, null, {
      headers: {
        "content-type": "application/json",
      },
    });
  
    if (response.status === 200 && response.data && response.data.auth && response.headers.expires) {
      let sessionResponse = new SessionResponse();
  
      sessionResponse.auth = response.data.auth.access_token;
      sessionResponse.expires = new Date(response.headers.expires).getTime();
      sessionResponse.sessionToken = response.data.session_token;
  
      return new Result(sessionResponse);
    } else {
      throw new Error("Error fetching tokens.");
    }
  }
  
  export { sendMessage, validateToken, getTokens };
