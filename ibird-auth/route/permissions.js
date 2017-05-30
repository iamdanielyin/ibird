'use strict';

/**
 * 内置路由：权限列表接口
 * Created by yinfxs on 2017/4/19.
 */

const auth = require('../index');

module.exports = async (ctx) => {
    const _query = ctx.query;
    const _cookies = ctx.cookies;
    const _body = ctx.request.body;
    const _reponse = { data: {}, errmsg: null, errcode: null };

    const userid = _cookies.get('IBIRD_USERID') || _cookies.get('IBIRD_UNIONID') || _query.userid || _body.userid;
    const unionid = userid || _query.unionid || _body.unionid;

    const result = auth.permissions(unionid);
    Object.assign(_reponse, { data: result });

    ctx.body = _reponse;
};