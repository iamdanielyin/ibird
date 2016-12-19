/**
 * 鉴权中间件
 * Created by yinfxs on 16-6-7.
 */
const _ = require('lodash');
const i18n = require('../utils/i18n');

module.exports = function (req, res, next) {
    const token = req.access_token;
    if (!token) return next();
    const roles = token.data.roles;
    if (!roles || !_.isArray(roles) || roles.length == 0) return next();
    const moduleCode = req.moduleCode;
    const modelCode = req.modelCode;

    let action;//资源标识
    if (moduleCode && modelCode) {
        //默认路由
        if (!req.auths) return next();
        const actid = req.actid;
        const prefix = `${moduleCode}:${modelCode}`;
        action = `${prefix}:${actid}:service`;
        action = action ? action.replace(/:/g, '_') : action;
    } else {
        //自定义路由
        action = req.authid;
    }
    if (!action) return next();
    if (roles.indexOf(action) == -1) return res.json({err: {message: '无接口权限'}});
    next();
};