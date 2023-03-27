/**
 * 暫停執行一段時間。
 * @param {number} time 要暫停的時間，以毫秒為單位。
 * @returns {Promise<void>} 當暫停完成時解析的 Promise。
 */
function wait(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export default wait;
