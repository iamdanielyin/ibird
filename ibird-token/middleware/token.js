/**
 * 令牌中间件
 * Created by yinfxs on 2017/4/18.
 */
const token = require('../index');
const i18nUtils = require('../utils/i18n');
const tokenUtils = require('../utils/token');

module.exports = (app) => {
    app.use(async (ctx, next) => {
        const _ignoreURLs = token.ignoreURLs && Array.isArray(token.ignoreURLs) ? token.ignoreURLs : [];
        const _expiredMiddleware = token.expiredMiddleware;
        const _pathname = ctx.req._parsedUrl.pathname;
        const _method = ctx.req.method;

        let ignore = false;
        if (_ignoreURLs.indexOf(_pathname) >= 0) {
            ignore = true;
        } else {
            for (let obj of _ignoreURLs) {
                if (typeof obj !== 'object') continue;
                let {
                    url,
                    method
                } = obj;
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
        try {
            const access_token = tokenUtils(ctx);
            const _token = await token.authentication(access_token);
            ctx._token = _token;
        } catch (e) {
            if (ignore) {
                return await next();
            } else {
                if (typeof _expiredMiddleware === 'function') {
                    return await _expiredMiddleware(ctx, next);
                } else {
                    return ctx.body = {
                        errmsg: i18nUtils(ctx, 'invalid_access_token'),
                        errcode: 555
                    };
                }
            }
        }

        try {
            await next();
        } catch (e) {
            return ctx.body = {
                errmsg: i18nUtils(ctx, 'api_call_exception'),
                errcode: 500
            };
        }
    });
};