import LogLevel from "../enums/log-level.js";
import getCurrentTime from "../utils/getCurrentTime.js";

/**
 * 代表日誌。
 */
class Log {
    /**
     * 日誌級別。
     */
    logLevel: LogLevel;

    /**
     * 初始化 Log 類別的新執行個體。
     * @param {LogLevel} logLevel 日誌級別。
     */
    constructor(logLevel: LogLevel) {
        this.logLevel = logLevel;
    }

    private isObject(a: any) {
        return !!a && a.constructor === Object;
    }

    private isArray(a: any) {
        return !!a && a.constructor === Array;
    }

    /**
     * 對追蹤級別日誌進行記錄。
     * @param {*} message 訊息或物件。
     */
    trace(message: any) {
        if (this.isArray(message) || this.isObject(message)) message = JSON.stringify(message);
        if (this.logLevel <= LogLevel.Trace) {
            console.log(`[TRACE] ${getCurrentTime()} ${message}`);
        }
    }

    /**
     * 對偵錯級別日誌進行記錄。
     * @param {*} message 訊息或物件。
     */
    debug(message: any) {
        if (this.isArray(message) || this.isObject(message)) message = JSON.stringify(message);
        if (this.logLevel <= LogLevel.Debug) {
            console.log(`[DEBUG] ${getCurrentTime()} ${message}`);
        }
    }

    /**
     * 對資訊級別日誌進行記錄。
     * @param {*} message 訊息或物件。
     */
    info(message: any) {
        if (this.isArray(message) || this.isObject(message)) message = JSON.stringify(message);
        if (this.logLevel <= LogLevel.Info) {
            console.log(`[INFO] ${getCurrentTime()} ${message}`);
        }
    }

    /**
     * 對警告級別日誌進行記錄。
     * @param {*} message 訊息或物件。
     */
    warn(message: any) {
        if (this.isArray(message) || this.isObject(message)) message = JSON.stringify(message);
        if (this.logLevel <= LogLevel.Warning) {
            console.log(`[WARN] ${getCurrentTime()} ${message}`);
        }
    }

    /**
     * 對錯誤級別日誌進行記錄。
     * @param {*} message 訊息或物件。
     */
    error(message: any) {
        if (this.isArray(message) || this.isObject(message)) message = JSON.stringify(message);
        if (this.logLevel <= LogLevel.Error) {
            console.log(`[ERROR] ${getCurrentTime()} ${message}`);
        }
    }
}

export default Log;
