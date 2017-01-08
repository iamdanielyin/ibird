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
    const _id = token.data._id;
    if ('ibird' == _id) return next();
    if (!roles || !_.isArray(roles) || roles.length == 0) return res.json({err: {message: '无接口权限'}});

    const moduleCode = req.moduleCode;
    const modelCode = req.modelCode;

    let action;//资源标识
    if (moduleCode && modelCode) {
        //默认路由
        if (!req.auths) return next();
        const actid = req.actid;
        const prefix = `${moduleCode}:${modelCode}`;
        action = `${prefix}:${actid}:service`;
    } else {
        //自定义路由
        action = req.authid;
    }
    action = action ? action.replace(/:/g, '_') : action;
    if (!action || roles.indexOf(action) == -1) return res.json({err: {message: '无接口权限'}});
    next();
};