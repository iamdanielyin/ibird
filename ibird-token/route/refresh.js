'use strict';

/**
 * 内置路由：刷新令牌
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');

module.exports = (router) => {
    router.post('/refresh', async (ctx) => {
        const _query = ctx.query;
        const _cookies = ctx.cookies;
        const _body = ctx.request.body || {};
        const _reponse = { data: {}, errmsg: null, errcode: null };

        const access_token = _cookies.get(token.COOKIETOKEN) || _query[token.TOKENKEY] || _body[token.TOKENKEY];
        try {
            let _token = await token.authentication(access_token);
            _token = await token.refresh(_token.refresh_token);

            Object.assign(_reponse, { data: _token });
            ctx.set('Cache-Control', 'no-cache');
            ctx.cookies.set(token.COOKIETOKEN, _token.access_token);
        } catch (e) {
            Object.assign(_reponse, { errmsg: `刷新令牌异常：${e.message}`, errcode: '500' });
        }
        ctx.body = _reponse;
    });
};