/**
 * 权限验证中间件
 * Created by yinfxs on 16-6-7.
 */
const adapter = require('../token/adapter');
const i18n = require('../utils/i18n');

module.exports = function (req, res, next) {
    const access_token = req.query.access_token;
    adapter.authentication(access_token, function (err, result) {
        if (err || !result) {
            console.error(err);
            return res.json({err: {message: i18n.value('unauthorized_operation')}});
        }
        next();
    });
};