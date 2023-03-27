/**
 * 定義日誌級別的列舉型別。
 * @enum {number}
 */
enum LogLevel {
    /**
     * 追蹤級別日誌。
     */
    Trace = 0,
    /**
     * 偵錯級別日誌。
     */
    Debug = 1,
    /**
     * 資訊級別日誌。
     */
    Info = 2,
    /**
     * 警告級別日誌。
     */
    Warning = 3,
    /**
     * 錯誤級別日誌。
     */
    Error = 4
}

export default LogLevel;

