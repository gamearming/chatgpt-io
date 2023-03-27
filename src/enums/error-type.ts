/**
 * 定義錯誤類型的列舉型別。
 * @enum {number}
 */
 enum ErrorType {
    /**
     * 超時錯誤。
     */
    Timeout = 1,
    /**
     * 帳號速率限制超過錯誤。
     */
    AccountRateLimitExceeded = 2,
    /**
     * 另一條訊息正在進行中錯誤。
     */
    AnotherMessageInProgress = 3,
    /**
     * 對話金鑰過期錯誤。
     */
    SessionTokenExpired = 4,
    /**
     * 訊息過長錯誤。
     */
    MessageTooLong = 5,
    /**
     * 找不到對話錯誤。
     */
    ConversationNotFound = 6,
    /**
     * 未知錯誤。
     */
    UnknownError = 7,
}

export default ErrorType;
