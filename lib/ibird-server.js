/**
 * ibird
 * Created by yinfxs on 16-5-30.
 */

'use strict';

/**
 * 模块依赖
 */

const moment = require('moment');
const mongoose = require('mongoose');
const _ = require('underscore');
const app = require('./ibird-express');
const express = require('express');
const model = require('./ibird-model');
const route = require('./ibird-route');
var configs = {};

moment.locale('zh-cn');

const models = {};

/**
 * 注册模型默认路由：增删改查
 * @param moduleCode 模型编码
 * @param moduleRoutes 声明路由
 */
function moduleRoutes(moduleCode, moduleRoutes) {
    if (!moduleRoutes) return;
    Object.keys(moduleRoutes).map(function (rule) {
        if (!rule) return;
        if (_.isFunction(moduleRoutes[rule])) {
            app.get('/' + moduleCode + rule, moduleRoutes[rule]);
            return;
        }
        Object.keys(moduleRoutes[rule]).map(function (method) {
            if (!method) return;
            app[method]('/' + moduleCode + rule, moduleRoutes[rule][method]);
        });
    });
}
/**
 * 注册模型默认路由：增删改查
 * @param moduleModels
 */
function modelRoutes(moduleModels) {
    Object.keys(moduleModels).map(function (key) {
        if (!key || models[key]) return;
        models[key] = moduleModels[key];
        //注册模型路由
        route(app, key, models[key]);
    });
}

/**
 * 初始化配置
 *
 * @returns {string}
 */
exports.init = function init(adminConfig) {
    configs = adminConfig;
    mongoose.connect(adminConfig.config.mongodb);
    const modules = _.pick(adminConfig, 'modules').modules;
    Object.keys(modules).map(function (code) {
        const module = modules[code];
        //注册模块声明路由
        moduleRoutes(code, module.routes);
        //注册模型和模型默认路由
        modelRoutes(model(code, module.schemas));
    });
    exports.configs = configs;

    app.use(adminConfig.publicRoot.substring(adminConfig.publicRoot.lastIndexOf('/')), express.static(adminConfig.publicRoot));

    exports.app = app;

};

/**
 * 获取model
 * @param code
 */
exports.model = function (code) {
    return models[code] || null;
};


/**
 * 路由
 */
exports.start = function () {
    app.listen(3000, function () {
        console.log('服务已正常运行，监听端口为3000，本地访问地址：http://127.0.0.1:3000');
    });
};