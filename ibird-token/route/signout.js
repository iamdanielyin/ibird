/**
 * 内置路由：登出
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');
const i18nUtils = require('../utils/i18n');
const tokenUtils = require('../utils/token');

module.exports = (router) => {
    router.post('/signout', async (ctx) => {
        try {
            const access_token = tokenUtils(ctx);
            await token.remove(access_token);
            ctx.cookies.set(token.COOKIETOKEN, null, {
                maxAge: 0
            });
            ctx.cookies.set(token.COOKIEUSERID, null, {
                maxAge: 0
            });
            ctx.body = {
                data: i18nUtils(ctx, 'logout_successful')
            };
        } catch (e) {
            ctx.body = {
                errmsg: i18nUtils(ctx, 'logout_failed'),
                errcode: '500'
            }
        }
    });
};