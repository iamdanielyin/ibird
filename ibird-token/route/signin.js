'use strict';

/**
 * 内置路由：界面登录
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');

module.exports = (router) => {
    router.post('/signin', async (ctx) => {
        const _reponse = { data: {}, errmsg: null, errcode: null };

        try {
            const _data = await token.condition(ctx);
            const _token = await token.authorization(Promise.resolve(_data));
            Object.assign(_reponse, { data: _token });
            ctx.set('Cache-Control', 'no-cache');
            ctx.cookies.set(token.COOKIETOKEN, _token.access_token);
            ctx.cookies.set(token.COOKIEUSERID, _data[token.useridKey]);
        } catch (e) {
            Object.assign(_reponse, { errmsg: `登录接口异常：${e.message}`, errcode: '500' });
        }
        ctx.body = _reponse;
    });
};