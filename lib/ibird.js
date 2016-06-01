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
const model = require('./ibird-model');
const route = require('./ibird-route');
moment.locale('zh-cn');

const models = {};

var configs = {};

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
        //注册模型
        const moduleModels = model(code, module.schemas);
        Object.keys(moduleModels).map(function (key) {
            if (!key || models[key]) return;
            models[key] = moduleModels[key];
            //注册路由
            route(app, key, models[key]);
        });
    });
};

/**
 * 获取model
 * @param code
 */
exports.model = function (code) {
    return models[code] || null;
};

/**
 * 路由注册
 * @param rules 路由规则
 * @param options 参数
 * @param callback 回调函数
 */
exports.route = function (rules, options, callback) {

};

exports.app = app;

exports.run = function () {
    app.listen(3000, function () {
        console.log('服务已正常运行，监听端口为3000，本地访问地址：http://127.0.0.1:3000');
    });
};