const model = require('../model');
const utility = require('ibird-utils');
const hooks = require('../hooks');
const common = require('../common');

/**
 * 默认列表查询路由
 * @param name 模型名称
 * @param [pre] 前置处理函数（数组）
 * @param [post] 后置处理函数（数组）
 */
module.exports = (name, pre, post) => {
    return async ctx => {
        //定义通用返回结构
        const response = common.response;

        const _query = ctx.query;
        const _range = ctx._range || {};

        _query.cond = utility.parse(_query.cond);
        _query.cond = Object.keys(_range).length > 0 ? { $and: [_range, _query.cond] } : _query.cond;
        try {
            const one = await model.one(name, _query.cond, async (query) => {
                await hooks(pre, { ctx, query });
            });
            const result = Object.assign({}, response, { data: one });
            await hooks(post, { ctx, data: result });
            ctx.body = result;
        } catch (e) {
            ctx.body = Object.assign({}, response, { errmsg: utility.errors(e), errcode: '500' });
        }
    };
};