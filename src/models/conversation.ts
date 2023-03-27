/**
 * 定義對話的屬性。
 * @interface
 */
interface Conversation {
    /**
     * 對話 ID。
     * @type {string}
     */
    id: string;
    /**
     * 上一個對話 ID。
     * @type {string}
     */
    conversationId?: string;
    /**
     * 父對話 ID。
     * @type {string}
     */
    parentId: string;
    /**
     * 最後活動時間。
     * @type {number}
     */
    lastActive: number;
}

export default Conversation;
