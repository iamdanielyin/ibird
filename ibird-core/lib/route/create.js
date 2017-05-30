const model = require('../model');
const utility = require('ibird-utils');
const hooks = require('../hooks');
const common = require('../common');

/**
 * 默认创建路由
 * @param name 模型名称
 * @param [pre] 前置处理函数（数组）
 * @param [post] 后置处理函数（数组）
 */
module.exports = (name, pre, post) => {
    return async ctx => {
        //定义通用返回结构
        const response = common.response;
        try {
            await hooks(pre, { ctx, data: ctx.request.body });
            const data = await model.create(name, ctx.request.body);
            const result = Object.assign({}, response, { data });
            await hooks(post, { ctx, data: result });
            ctx.body = result;
        } catch (e) {
            ctx.body = Object.assign({}, response, { errmsg: utility.errors(e), errcode: '500' });
        }
    };
};