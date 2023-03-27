/**
 * SessionResponse 界面定義當從對話機器人獲取對話回應時，將使用哪些屬性來構建回答。
 * @interface
 */
interface SessionResponse {
    /**
     * 對話金鑰。
     * @type {string}
     */
    sessionToken: string;
    /**
     * 授權。
     * @type {string}
     */
    auth: string;
    /**
     * 過期時間。
     * @type {string}
     */
    expires: string;
}

export default SessionResponse;
