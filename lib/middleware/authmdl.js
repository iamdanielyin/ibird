/**
 * 权限验证中间件
 * Created by yinfxs on 16-6-7.
 */
const auth = require('../utils/auth');
const i18n = require('../utils/i18n');

module.exports = function (req, res, next) {
    const access_token = req.get('access_token');
    auth.authentication(access_token, function (err, result) {
        if (err || !result) return res.json({err: {message: i18n.value('unauthorized_operation')}});
        next();
    })
};