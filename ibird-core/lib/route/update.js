const model = require('../model');
const utility = require('ibird-utils');
const hooks = require('../hooks');
const common = require('../common');

/**
 * 默认更新路由
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
        body.doc = body.doc || utility.parse(ctx.query.doc);
        ctx.request.body = body;
        try {
            await hooks(pre, { ctx, data: body });
            const _body = ctx.request.body;
            const data = await model.update(name, _body.cond, _body.doc, _body.options || { multi: true });
            const result = Object.assign({}, response, { data });
            await hooks(post, { ctx, data: result });
            ctx.body = result;
        } catch (e) {
            ctx.body = Object.assign({}, response, { errmsg: utility.errors(e), errcode: '500' });
        }
    };
};