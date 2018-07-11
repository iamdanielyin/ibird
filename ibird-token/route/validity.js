'use strict';

/**
 * 内置路由：令牌有效性验证
 * Created by yinfxs on 2017/4/19.
 */

const token = require('../index');
const i18nUtils = require('../utils/i18n');
const tokenUtils = require('../utils/token');

module.exports = (router) => {
    router.post('/validity', async (ctx) => {
        try {
            const access_token = tokenUtils(ctx);
            const tokenData = await token.authentication(access_token);
            ctx.body = {
                data: tokenData
            };
        } catch (e) {
            ctx.body = {
                errmsg: i18nUtils(ctx, 'invalid_access_token'),
                errcode: 503
            };
        }
    });
};