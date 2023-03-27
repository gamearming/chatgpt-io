/**
 * 訊息內容的定義。
 * @interface
 */
interface MessageContent {
    /**
     * 內容類型。
     * @type {string}
     */
    content_type: string;
    /**
     * 字串陣列。
     * @type {string[]}
     */
    parts: string[];
}

/**
 * 訊息元數據的定義。
 * @interface
 */
interface MessageMetadata {
    /**
     * 訊息類型。
     * @type {string}
     */
    message_type: string;
    /**
     * 模型標誌。
     * @type {string}
     */
    model_slug: string;
}

/**
 * 定義一個對話訊息。
 * @interface
 */
interface Message {
    /**
     * 訊息 ID。
     * @type {string}
     */
    id: string;
    /**
     * 訊息角色。
     * @type {string}
     */
    role: string;
    /**
     * 使用者。
     * @type {any}
     */
    user: any;
    /**
     * 建立時間。
     * @type {any}
     */
    create_time: any;
    /**
     * 更新時間。
     * @type {any}
     */
    update_time: any;
    /**
     * 訊息內容。
     * @type {MessageContent}
     */
    content: MessageContent;
    /**
     * 是否結束回合。
     * @type {any}
     */
    end_turn: any;
    /**
     * 重量。
     * @type {number}
     */
    weight: number;
    /**
     * 訊息元數據。
     * @type {MessageMetadata}
     */
    metadata: MessageMetadata;
    /**
     * 收件人。
     * @type {string}
     */
    recipient: string;
}

/**
 * 定義一個對話。
 * @interface
 */
interface Conversation {
    /**
     * 訊息。
     * @type {Message}
     */
    message: Message;
    /**
     * 對話 ID。
     * @type {string}
     */
    conversation_id: string;
    /**
     * 錯誤消息。
     * @type {any}
     */
    error: any;
}

export { Conversation };
