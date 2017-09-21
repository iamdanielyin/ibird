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
            if (!_data) throw new Error(`账号密码不正确`);
            const _token = await token.authorization(Promise.resolve(_data));
            Object.assign(_reponse, { data: _token });
            ctx.set('Cache-Control', 'no-cache');
            ctx.cookies.set(token.COOKIETOKEN, _token.access_token);
            if (_data && _data[token.useridKey]) {
                ctx.cookies.set(token.COOKIEUSERID, _data[token.useridKey]);
            }
        } catch (e) {
            Object.assign(_reponse, { errmsg: e.message || '登录失败，请稍后再试！', errcode: '500', errstack: e });
        }
        ctx.body = _reponse;
    });
};