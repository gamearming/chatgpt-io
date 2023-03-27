import ErrorType from "../enums/error-type.js";

/**
 * 定義帶有結果的介面。
 * @interface
 * @template Type 泛型型別參數，表示傳回值的類型。
 */
interface Result<Type> {
    /**
     * 狀態。
     * @type {boolean}
     */
    status: boolean;
    /**
     * 數據。
     * @type {Type}
     */
    data: Type;
    /**
     * 錯誤類型。
     * @type {ErrorType}
     */
    errorType: ErrorType;
    /**
     * 錯誤訊息。
     * @type {string}
     */
    error: string;
}

export default Result;
