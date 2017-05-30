'use strict';

/**
 * 内置路由：令牌有效性验证
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');

module.exports = async (ctx) => {
    const _query = ctx.query;
    const _cookies = ctx.cookies;
    const _body = ctx.request.body || {};
    const _reponse = { data: {}, errmsg: null, errcode: null };

    const access_token = _cookies.get(token.COOKIETOKEN) || _query[token.TOKENKEY] || _body[token.TOKENKEY];
    try {
        const _token = await token.authentication(access_token);
        Object.assign(_reponse, { data: _token });
    } catch (e) {
        Object.assign(_reponse, { errmsg: `访问令牌验证失败：${e.message}`, errcode: '503' });
    }
    ctx.body = _reponse;
};