/**
 * 权限验证中间件
 * Created by yinfxs on 16-6-7.
 */
const auth = require('../ibird-auth');

module.exports = function (req, res, next) {
    const access_token = req.get('access_token');
    auth.authentication(access_token, function (err, result) {
        if (err || !result) return res.json({err: {message: '未授权操作'}});
        next();
    })
};