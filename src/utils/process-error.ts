import ErrorType from "../enums/error-type.js";

/**
 * 處理從對話機器人 API 返回的錯誤訊息，並傳回相應的錯誤類型。
 * @param {string} error 從對話機器人 API 傳回的錯誤訊息。
 * @returns {ErrorType} 傳回與錯誤訊息相關聯的錯誤類型。
 */
function ProcessError(error: string): ErrorType {
    if (!error) {
        return ErrorType.UnknownError;
    }
    if (typeof error !== "string") {
        return ErrorType.UnknownError;
    }
    if (error.toLowerCase().includes("too many requests")) {
        return ErrorType.AccountRateLimitExceeded;
    }
    if (error.toLowerCase().includes("try refreshing your browser")) {
        return ErrorType.UnknownError;
    }
    if (error.toLowerCase().includes("too long")) {
        return ErrorType.MessageTooLong;
    }
    if (error.toLowerCase().includes("one message at a time")) {
        return ErrorType.AnotherMessageInProgress;
    }
    if (error.toLowerCase().includes("expired")) {
        return ErrorType.SessionTokenExpired;
    }
    if (error.toLowerCase().includes("conversation not found")) {
        return ErrorType.ConversationNotFound;
    }
    return ErrorType.UnknownError;
}

export default ProcessError;
