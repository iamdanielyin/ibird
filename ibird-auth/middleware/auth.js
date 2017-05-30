'use strict';

/**
 * 权限中间件
 * Created by yinfxs on 2017/4/18.
 */
const auth = require('../index');

module.exports = async (ctx, next) => {
    const _query = ctx.query;
    const _cookies = ctx.cookies;
    const _body = ctx.request.body;
    const _pathname = ctx.req._parsedUrl.pathname;
    const _method = ctx.req.method;
    const _key = `${_pathname}|${_method.toUpperCase()}`;

    const userid = _cookies.get('IBIRD_USERID') || _cookies.get('IBIRD_UNIONID') || _query.userid || _body.userid;
    const unionid = userid || _query.unionid || _body.unionid;

    ctx._range = auth.range(unionid, _key);
    await next();
};