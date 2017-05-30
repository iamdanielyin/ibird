const model = require('../model');
const utility = require('ibird-utils');
const hooks = require('../hooks');
const common = require('../common');

/**
 * 默认删除路由
 * @param name 模型名称
 * @param [pre] 前置处理函数（数组）
 * @param [post] 后置处理函数（数组）
 */
module.exports = (name, pre, post) => {
    return async ctx => {
        //定义通用返回结构
        const response = common.response;

        const body = ctx.request.body;
        body.cond = body.cond || utility.parse(ctx.query.cond);
        body.emptied = body.emptied || ctx.query.emptied;
        ctx.request.body = body;
        try {
            const result = {};
            if (Object.keys(body.cond).length > 0 || body.emptied) {
                await hooks(pre, { ctx, data: body });
                const _body = ctx.request.body;
                const _r = await model.remove(name, _body.cond);
                Object.assign(result, _r.result || _r);
                await hooks(post, { ctx, data: result });
            }
            ctx.body = Object.assign({}, response, { data: result });
        } catch (e) {
            ctx.body = Object.assign({}, response, { errmsg: utility.errors(e), errcode: '500' });
        }
    };
};