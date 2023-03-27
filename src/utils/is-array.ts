/**
 * 判斷一個變數是否為陣列。
 * @param {*} a 要檢查的變數。
 * @returns {boolean} 如果傳入的變數是陣列，返回 true；否則，返回 false。
 */
function isArray(a: any) {
    return !!a && a.constructor === Array;
}

export default isArray;
