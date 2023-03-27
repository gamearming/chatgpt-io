/**
 * 判斷一個變數是否為物件。
 * @param {*} a 要檢查的變數。
 * @returns {boolean} 如果傳入的變數是物件，返回 true；否則，返回 false。
 */
function isObject(a: any) {
    return !!a && a.constructor === Object;
}

export default isObject;
