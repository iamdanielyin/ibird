/**
 * 提供应用缓存的功能
 */

/**
 * 应用缓存对象
 * @type {{}}
 * @private
 */
const _apps = {};

/**
 * 上下文函数
 * @param name
 * @param app
 * @returns {*}
 */
function fn(name, app) {
    name = name || 'ibird';
    if (app) {
        _apps[name] = app;
    }
    return _apps[name];
}

module.exports = fn;