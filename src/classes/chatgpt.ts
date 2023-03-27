/**
 * 匯入模組
 */
import { randomUUID, createHash } from "node:crypto";
import LogLevel from "../enums/log-level.js";
import Log from "./log.js";
import ErrorType from "../enums/error-type.js";
import fs from "fs";
import Options from "../models/options.js";
import AccountType from "../enums/account-type.js";
import Conversation from "../models/conversation.js";
import wait from "../utils/wait.js";
import { sendMessage, getTokens, validateToken } from "../utils/chatgpt.js";

/**
 * ChatGPT 類別
 */
class ChatGPT {
    /**
     * 儲存 ChatGPT 的選項
     */
    private options: Options;

    /**
     * 設定檔案的路徑
     */
    private path: string;

    /**
     * 對話的 Token
     */
    public sessionToken: string;

    /**
     * 所有的對話紀錄
     */
    public conversations: Conversation[];

    /**
     * 存取 Token
     */
    public accessToken: string = null;

    /**
     * 是否暫停驗證 Token
     */
    private pauseTokenChecks: boolean;

    /**
     * Log 物件
     */
    private log: Log;

    /**
     * 簽名字串
     */
    private signature: string;

    /**
     * 自動儲存間隔 ID
     */
    private intervalId: NodeJS.Timeout;

    /**
     * 錯誤回調函數
     */
    public onError?(errorType: ErrorType, prompt?: string, conversationId?: string, parentId?: string): void;

    /**
     * ChatGPT 建構子
     * @param sessionToken 對話的 Token
     * @param options 選項
     */
    constructor(sessionToken: string, options?: Options) {
        this.options = {
            name: options?.name ?? "default",
            logLevel: options?.logLevel ?? LogLevel.Info,
            accountType: options?.accountType ?? AccountType.Free,
            saveInterval: options?.saveInterval ?? 1000 * 60,
            bypassNode: options?.bypassNode ?? "https://gpt.pawan.krd",
            configsDir: options?.configsDir ?? "configs",
        };

        this.path = `./${this.options.configsDir}/${this.options.name}-chatgpt-io.json`;
        this.log = new Log(this.options.logLevel);
        this.sessionToken = sessionToken;
        let [newSignature, newSessionToken] = this.getSignature();
        this.signature = newSignature;
        this.conversations = [];
        this.pauseTokenChecks = true;
        let targetDir = `./${this.options.configsDir}`;
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
        this.load();

        setInterval(async () => {
            if (this.pauseTokenChecks) return;

            this.pauseTokenChecks = true;

            if (!this.accessToken) {
                await this.getTokens();
                this.pauseTokenChecks = false;
                return;
            }

            if (!this.accessToken || !validateToken(this.accessToken)) return await this.getTokens();

            this.pauseTokenChecks = false;
        }, 3000);

        setInterval(() => {
            const now = Date.now();
            this.conversations = this.conversations.filter((conversation) => {
                return now - conversation.lastActive < 1800000; // 2 分鐘轉成毫秒
            });
        }, 60000);

        this.intervalId = setInterval(() => {
            this.save();
        }, this.options.saveInterval);

        process.on("beforeExit", async () => {
            clearInterval(this.intervalId);
            await this.save();
        });
    }

    /**
     * 取得簽名字串和新的對話 Token
     * @returns 簽名字串和新的對話 Token
     */
    private getSignature(): [string, string] {
        let hash = createHash("md5");
        hash.update(this.sessionToken);
        return [hash.digest("hex"), this.sessionToken.toString()];
    }

    /**
     * 載入設定檔案
     */
    private async load() {
        this.pauseTokenChecks = true;

        if (!fs.existsSync(this.path)) {
            await wait(1000);
            this.pauseTokenChecks = false;
            return;
        }

        let [newSignature, newSessionToken] = this.getSignature();
        let data = await fs.promises.readFile(this.path, "utf8");
        let json = JSON.parse(data);

        for (let key in json) {
            if (key === "signature") continue;
            this[key] = json[key];
        }

        await wait(1000);

        if (newSignature !== json["signature"]) {
            this.log.warn("Session token changed, re-authenticating the new session token...");
            this.accessToken = null;
            this.sessionToken = newSessionToken;
        }

        this.pauseTokenChecks = false;
    }

    /**
     * 儲存設定檔案
     */
    public async save() {
        let result: any = {};

        for (let key in this) {
            if (key === "pauseTokenChecks") continue;
            if (key === "path") continue;
            if (key === "saveInterval") continue;
            if (key === "intervalId") continue;
            if (key === "log") continue;

            if (this[key] instanceof Array || this[key] instanceof Object || typeof this[key] === "string" || typeof this[key] === "number" || typeof this[key] === "boolean") {
                result[key] = this[key];
            }
        }

        await fs.promises.writeFile(this.path, JSON.stringify(result, null, 4));
    }

    /**
     * 判斷字串是否為 UUID 格式
     * @param str 要判斷的字串
     * @returns 是否為 UUID 格式
     */
    private isUUID(str: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }

    /**
     * 新增對話紀錄
     * @param id 對話紀錄 ID
     * @param parentId 父對話紀錄 ID（如果有）
     * @returns 新增的對話紀錄
     */
    private addConversation(id: string, parentId?: string) {
        let conversation: Conversation = {
            id: id,
            conversationId: this.isUUID(id) ? id : null,
            parentId: this.isUUID(parentId) ? parentId : randomUUID(),
            lastActive: Date.now(),
        };

        this.conversations.push(conversation);
        this.save();

        return conversation;
    }

    /**
     * 根據 ID 取得對話紀錄
     * @param id 對話紀錄 ID
     * @param parentId 父對話紀錄 ID（如果有）
     * @returns 對話紀錄
     */
    private getConversationById(id: string, parentId?: string) {
        let conversation = this.conversations.find((conversation) => conversation.id === id);

        if (!conversation) {
            conversation = this.addConversation(id, parentId);
        } else {
            conversation.lastActive = Date.now();
        }

        return conversation;
    }

    /**
     * 重置特定 ID 的對話紀錄
     * @param id 要重置的對話紀錄 ID，預設為 "default"
     */
    public resetConversation(id: string = "default") {
        let conversation = this.conversations.find((conversation) => conversation.id === id);

        if (!conversation) return;

        conversation.conversationId = null;
    }

    /**
     * 發送訊息
     * @param callback 回調函數
     * @param prompt 訊息
     * @param id 對話紀錄 ID，預設為 "default"
     * @param parentId 父對話紀錄 ID（如果有）
     * @returns 傳回資料
     */
    public async send(callback: (arg0: string) => void, prompt: string, id: string = "default", parentId?: string) {
        if (!this.accessToken || !validateToken(this.accessToken)) await this.getTokens();

        let conversation = this.getConversationById(id, parentId);

        let model: string;

        switch (this.options.accountType) {
            case AccountType.Free:
                model = "text-davinci-002-render";
                break;
            case AccountType.Plus:
                model = "text-davinci-002";
                break;
            case AccountType.Pro:
                model = "text-davinci-002";
                break;
            default:
                model = "text-davinci-002-render";
        }

        let result = await sendMessage(this.accessToken, model, this.options.bypassNode, prompt, conversation.conversationId);

        if (result.success) {
            conversation.lastActive = Date.now();
            conversation.conversationId = result.data.conversation_id;

            if (callback) callback(result.data.choices[0].text);
            return result.data.choices[0].text;
        } else {
            if (this.onError) this.onError(ErrorType.Send, prompt, id, parentId);
            this.log.error(`Failed to send message: ${result.message}`);
            return null;
        }
    }

    /**
     * 取得 Access Token
     */
    private async getTokens() {
        let result = await getTokens(this.signature, this.sessionToken, this.options.accountType);

        if (result.success) {
            this.accessToken = result.data.access_token;
            this.pauseTokenChecks = false;
            return true;
        } else {
            if (this.onError) this.onError(ErrorType.Token, null, null, null);
            this.log.error(`Failed to get tokens: ${result.message}`);
            return false;
        }
    }
}

export default ChatGPT;
