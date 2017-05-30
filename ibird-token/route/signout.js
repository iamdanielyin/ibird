'use strict';

/**
 * 内置路由：登出
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');

module.exports = (router) => {
    router.post('/signout', async (ctx) => {
        const _query = ctx.query;
        const _cookies = ctx.cookies;
        const _body = ctx.request.body || {};
        const _reponse = { data: {}, errmsg: null, errcode: null };

        const access_token = _cookies.get(token.COOKIETOKEN) || _query[token.TOKENKEY] || _body[token.TOKENKEY];
        try {
            await token.remove(access_token);
            ctx.cookies.set(token.COOKIETOKEN, null, { maxAge: -1 });
            ctx.cookies.set(token.COOKIEUSERID, null, { maxAge: -1 });
        } catch (e) {
            Object.assign(_reponse, { errmsg: `退出登录异常：${e.message}`, errcode: '500' });
        }
        ctx.body = _reponse;
    });
};