'use strict';

/**
 * 内置路由：登录
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');

module.exports = async (ctx) => {
    const _user = (token.user !== null && typeof token.user === 'object') && !Array.isArray(token.user) ? token.user : {};
    const _params = _user.params;
    const _get = _user.get;
    const _userid = _user.userid || '_id';

    if (!Array.isArray(_params) || (typeof _get !== 'function')) throw new Error(`令牌模块配置异常：调用内置路由需正确配置参数"user"`);

    const _query = ctx.query;
    const _body = ctx.request.body || {};
    const _reponse = { data: {}, errmsg: null, errcode: null };

    const object = {};

    for (let param of _params) {
        if (typeof param !== 'string') continue;
        object[param] = _query[param] || _body[param];
    }

    try {
        const _user = await _get(object);
        const condition = (_user != null && typeof _user === 'object') && _user[_userid] != null ? true : false;
        const _token = await token.authorization(condition, _user);
        Object.assign(_reponse, { data: { token: _token, userid: _user[_userid], user: _user } });
        ctx.set('Cache-Control', 'no-cache');
        ctx.cookies.set(token.COOKIETOKEN, _token.access_token);
        ctx.cookies.set(token.COOKIEUSERID, _user[_userid]);
    } catch (e) {
        Object.assign(_reponse, { errmsg: `登录接口异常：${e.message}`, errcode: '500' });
    }
    ctx.body = _reponse;
};