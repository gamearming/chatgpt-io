import AccountType from "../enums/account-type.js";
import LogLevel from "../enums/log-level.js";

/**
 * 定義選項介面。
 * @interface
 */
interface Options {
    /**
     * 名稱。
     * @type {string}
     */
    name?: string;
    /**
     * 日誌級別。
     * @type {LogLevel}
    */
    logLevel?: LogLevel;
    /**
     * 繞過節點的位址。
     * @type {string}
     */
    bypassNode?: string;
    /**
     * 帳戶類型。
     * @type {AccountType}
     */
    accountType?: AccountType;
    /**
     * 設定檔目錄。
     * @type {string}
     */
    configsDir?: string;
    /**
     * 自動儲存時間間隔（以毫秒為單位）。
     * @type {number}
     */
    saveInterval?: number;
}

export default Options;
