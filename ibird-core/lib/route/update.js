const model = require('../model');
const utility = require('ibird-utils');
const config = require('../config');
const i18n = config.i18n;
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
        body.options = body.options || utility.parse(ctx.query.options);
        ctx.request.body = body;
        try {
            await hooks(pre, { ctx, data: body });
            const _body = ctx.request.body;
            if (Object.keys(_body.cond).length === 0 && (!body.options || !body.options.multi)) {
                ctx.body = { errmsg: i18n.get('update_api_params_error3'), errcode: '500' };
                return;
            }
            if (Object.keys(_body.doc).length === 0) {
                ctx.body = { errmsg: i18n.get('update_api_params_error4'), errcode: '500' };
                return;
            }
            const data = await model.update(name, _body.cond, _body.doc, _body.options);
            const result = Object.assign({}, response, { data });
            await hooks(post, { ctx, data: result });
            ctx.body = result;
        } catch (e) {
            ctx.body = Object.assign({}, response, { errmsg: utility.errors(e), errcode: '500' });
        }
    };
};