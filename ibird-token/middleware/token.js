'use strict';

/**
 * 令牌中间件
 * Created by yinfxs on 2017/4/18.
 */
const token = require('../index');

module.exports = (app) => {
    app.use(async (ctx, next) => {
        const _ignoreURLs = token.ignoreURLs && Array.isArray(token.ignoreURLs) ? token.ignoreURLs : [];
        const _fakeTokens = token.fakeTokens && Array.isArray(token.fakeTokens) ? token.fakeTokens : [];
        const _expiredMiddleware = token.expiredMiddleware;
        const _pathname = ctx.req._parsedUrl.pathname;
        const _method = ctx.req.method;

        let ignore = false;
        if (_ignoreURLs.indexOf(_pathname) >= 0) {
            ignore = true;
        } else {
            for (let obj of _ignoreURLs) {
                if (typeof obj !== 'object') continue;
                let { url, method } = obj;
                if (!url && !method && obj instanceof RegExp && obj.test(_pathname) === true) {
                    ignore = true;
                    break;
                }
                if (!url || !method) continue;
                method = Array.isArray(method) ? method : [method];
                for (let i = 0; i < method.length; i++) {
                    const m = method[i];
                    if (!m) continue;
                    method[i] = m.toUpperCase();
                }
                if (method.indexOf(_method) < 0) continue;

                if ((url === _pathname) || (url instanceof RegExp && url.test(_pathname) === true)) {
                    ignore = true;
                    break;
                }
            }
        }
        const _query = ctx.query;
        const _cookies = ctx.cookies;
        const _body = ctx.request.body || {};
        const _reponse = { data: {}, errmsg: null, errcode: null };

        let access_token = _query[token.TOKENKEY] || _body[token.TOKENKEY];
        if (!access_token) {
            if (ctx.get('Authorization')) {
                const _authorization = ctx.get('Authorization');
                const _split = _authorization.split(' ');
                if (_split.length >= 1) access_token = _split[1];
            } else if (ctx.get(token.TOKENKEY)) {
                access_token = ctx.get(token.TOKENKEY);
            } else if (ctx.get(token.TOKENKEY.toUpperCase())) {
                access_token = ctx.get(token.TOKENKEY.toUpperCase());
            } else if (ctx.get('token')) {
                access_token = ctx.get('token');
            } else if (ctx.get('TOKEN')) {
                access_token = ctx.get('TOKEN');
            } else if (ctx.get('access-token')) {
                access_token = ctx.get('access-token');
            } else if (ctx.get('ACCESS-TOKEN')) {
                access_token = ctx.get('ACCESS-TOKEN');
            }else{
                access_token = _cookies.get(token.COOKIETOKEN); // cookie优先级最低
            }
        }
        
        try {
            const _token = await token.authentication(access_token);
            ctx._token = _token;
        } catch (e) {
            if (ignore) {
                return await next();
            } else {
                if (typeof _expiredMiddleware === 'function') {
                    return await _expiredMiddleware(ctx, next);
                } else {
                    return ctx.body = Object.assign(_reponse, { errmsg: `访问令牌验证失败：${e.message}`, errcode: '555' });
                }
            }
        }

        try {
            await next();
        } catch (e) {
            return ctx.body = Object.assign(_reponse, { errmsg: `数据服务异常：${e.message}`, errcode: '500' });
        }
    });
};