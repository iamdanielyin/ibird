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
        _query.cond = utility.parse(_query.cond);
        let _project = utility.parse(_query.project);
        _project = Object.keys(_project).length > 0 ? _project : utility.str2Obj(_query.project);
        _query.project = _project;

        try {
            const one = await model.one(name, _query.cond, async (query) => {
                await hooks(pre, { ctx, query });
            }, _query.project);
            const result = Object.assign({}, response, { data: one });
            await hooks(post, { ctx, data: result });
            ctx.body = result;
        } catch (e) {
            ctx.body = Object.assign({}, response, { errmsg: utility.errors(e), errcode: '500' });
        }
    };
};