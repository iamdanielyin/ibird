/**
 * 钩子处理
 * @param fns 处理函数数组类型
 * @param data 传递参数
 * @returns {Promise.<*>}
 */
module.exports = async (fns, data) => {
    if (!fns) return;
    if (!Array.isArray(fns) || fns.length === 0) fns = [fns];
    for (const fn of fns) {
        if (typeof fn !== 'function') continue;
        await fn(data);
    }
};