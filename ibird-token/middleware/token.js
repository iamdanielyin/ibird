'use strict';

/**
 * 令牌中间件
 * Created by yinfxs on 2017/4/18.
 */
const token = require('../index');

module.exports = async (ctx, next) => {
    const _ignoreURLs = Array.isArray(token.ignoreURLs) ? token.ignoreURLs : [];
    const _pathname = ctx.req._parsedUrl.pathname;
    const _method = ctx.req.method;

    if (_ignoreURLs.length > 0) {
        if (_ignoreURLs.indexOf(_pathname) >= 0) return next();
        for (let obj of _ignoreURLs) {
            if (typeof obj !== 'object') continue;
            let { url, method } = obj;
            if (!url && !method && obj instanceof RegExp && obj.test(_pathname) === true) return next();
            if (!url || !method) continue;
            method = Array.isArray(method) ? method : [method];
            for (let i = 0; i < method.length; i++) {
                const m = method[i];
                if (!m) continue;
                method[i] = m.toUpperCase();
            }
            if (method.indexOf(_method) < 0) continue;

            if (url === _pathname) return next();
            if (url instanceof RegExp && url.test(_pathname) === true) return next();
        }
    }

    const _query = ctx.query;
    const _cookies = ctx.cookies;
    const _body = ctx.request.body || {};
    const _reponse = { data: {}, errmsg: null, errcode: null };

    const access_token = _cookies.get(token.COOKIETOKEN) || _query[token.TOKENKEY] || _body[token.TOKENKEY];
    try {
        const _token = await token.authentication(access_token);
        ctx._token = _token;
        await next();
    } catch (e) {
        ctx.body = Object.assign(_reponse, { errmsg: `访问令牌验证失败：${e.message}`, errcode: '503' });
    }
};