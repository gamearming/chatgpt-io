/**
 * AskResponse 界面定義了當從對話機器人獲取回答時，將使用哪些屬性來構建回答。
 * @interface
 */
interface AskResponse {
    /**
     * 回答的內容。
     * @type {string}
     */
    answer: string;
    /**
     * 息 ID。
     * @type {string}
     */
    messageId: string;
    /**
     * 對話 ID。
     * @type {string}
     */
    conversationId: string;
}

export default AskResponse;
