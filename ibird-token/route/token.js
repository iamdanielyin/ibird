'use strict';

/**
 * 内置路由：获取令牌
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');

/**
 * 客户端验证
 * @param client_id 公钥
 * @param client_secret 私钥
 */
function clientAuthentication({ client_id, client_secret }) {
    if (!token.client || typeof token.client !== 'object') return false;
    if (token.client[client_id] && token.client[client_id] === client_secret) return true;
    return false;
}

module.exports = (router) => {
    router.post('/token', async (ctx) => {
        const _authorization = ctx.get('Authorization');
        const _split = _authorization.split(' ');

        // 验证client
        const _client = _split[1];
        let authResult = false;
        if (_client) {
            const clientSplit = new Buffer(_client, 'base64').toString().split(':');
            authResult = clientAuthentication({ client_id: clientSplit[0], client_secret: clientSplit[1] });
        }
        if (authResult !== true) return ctx.throw(403, `Invalid client`);
        try {
            const _data = await token.condition(ctx);
            const _token = await token.authorization(Promise.resolve(_data));

            ctx.set('Cache-Control', 'no-cache');
            ctx.cookies.set(token.COOKIETOKEN, _token.access_token);
            ctx.cookies.set(token.COOKIEUSERID, _data[token.useridKey]);
            ctx.body = _token;
        } catch (e) {
            ctx.throw(400, `Authorization failure: ${e.message}`);
        }
    });
};