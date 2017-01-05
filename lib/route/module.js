/**
 * 模块路由注册
 * Created by yinfxs on 16-8-3.
 */

'use strict';

const _ = require('lodash');
const i18n = require('../utils/i18n');
const authmdl = require('../middleware/authmdl');
const transmdl = require('../middleware/transmdl');

/**
 * 挂载模块路由
 * @param app Express实例
 * @param modules 模块配置部分
 * @param ruprefix 接口前缀
 * @param callback 回调函数
 */
module.exports = (app, modules, ruprefix = '', callback) => {
    modules.forEach(function (module) {
        const moduleCode = module.code;//模块编码
        const moduleRoutes = module.routes;//模块路由配置部分
        if (!moduleRoutes) return;
        Object.keys(moduleRoutes).forEach(rule => {
            if (!rule) return;
            if (_.isFunction(moduleRoutes[rule])) {
                app.get(ruprefix + '/' + moduleCode + rule, moduleRoutes[rule]);
                return;
            }
            Object.keys(moduleRoutes[rule]).forEach(method => {
                if (!method) return;
                let handler = moduleRoutes[rule][method], authid;
                // handler = _.isFunction(handler) ? handler : handler.handler;
                if (!_.isFunction(handler)) {
                    authid = handler.authid;
                    handler = handler.handler;
                }
                if (authid) {
                    //添加授权中间件
                    handler = _.isArray(handler) ? handler : [handler];
                    handler.unshift(function (req, res, next) {
                        req.authid = authid;
                        next();
                    }, transmdl, authmdl);
                }
                if (!_.isFunction(handler) && !_.isArray(handler)) return;
                app[method.trim().toLowerCase()](ruprefix + '/' + moduleCode + (rule.startsWith('/') ? rule : '/' + rule), handler);
            });
        });
    });
    if (_.isFunction(callback)) callback();
};