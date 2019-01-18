/**
 * 内置路由：界面登录
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');
const i18nUtils = require('../utils/i18n');
const moment = require('moment');

module.exports = (router) => {
    router.post('/signin', async (ctx) => {
        try {
            const rawData = await token.condition(ctx);
            if (!rawData) throw new Error(i18nUtils(ctx, 'login_failed'));
            const tokenData = await token.authorization(Promise.resolve(rawData));
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
            console.error(e)
            ctx.body = {
                errmsg: e.message || i18nUtils(ctx, 'login_failed'),
                errcode: 500
            }
        }
    });
};