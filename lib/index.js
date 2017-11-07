/**
 * 应用声明模块
 */

const App = require('./application');
const context = require('./context');

/**
 * 导出应用类
 * @type {App}
 */
module.exports.App = App;

/**
 * 导出上下文函数
 * @type {fn}
 */
module.exports.context = module.exports.ctx = context;