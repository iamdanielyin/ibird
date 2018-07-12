/**
 * 内置路由：刷新令牌
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');
const i18nUtils = require('../utils/i18n');
const tokenUtils = require('../utils/token');
const moment = require('moment');

module.exports = (router) => {
    router.post('/refresh', async (ctx) => {
        try {
            const access_token = tokenUtils(ctx);
            let tokenData = await token.authentication(access_token);
            tokenData = await token.refresh(data.refresh_token);
            const expires = new Date(moment().add(tokenData.expires_in, 's'));
            ctx.cookies.set(token.COOKIETOKEN, tokenData.access_token, {
                expires
            });
            if (tokenData.data && tokenData.data[token.useridKey]) {
                ctx.cookies.set(token.COOKIEUSERID, tokenData.data[token.useridKey], {
                    expires
                });
            }
            ctx.body = {
                data: tokenData
            }
        } catch (e) {
            ctx.body = {
                errmsg: i18nUtils(ctx, 'token_refresh_failed'),
                errcode: 500
            }
        }
    });
};