/**
 * ibird
 * Created by yinfxs on 16-5-30.
 */

'use strict';

/**
 * 模块依赖
 */

const mongoose = require('mongoose');
const _ = require('underscore');
const path = require('path');
const express = require('express');

const app = require('./ibird-express');
const model = require('./ibird-model');
const route = require('./ibird-route');
const Redis = require('./ibird-redis');
const auth = require('./ibird-auth');
const authMiddleware = require('./middleware/auth');
const moment = require('moment');
moment.locale('zh-cn');
var configs = {}, models = {}, redis;


/**
 * 初始化配置
 *
 * @returns {string}
 */
exports.initialize = function (adminConfig) {
    configs = adminConfig;

    mongoose.connect(adminConfig.config.mongodb);//MongoDB连接初始化
    redis = Redis(adminConfig.config.redis);//Redis连接初始化
    auth.initialize(adminConfig.config.auth);//授权初始化

    //挂载express中间件
    if (adminConfig.middlewares) adminConfig.middlewares(app);

    app.use(express.static(path.resolve(__dirname, '../client/' + (process.env.NODE_ENV == 'production' ? 'dist' : 'build'))));

    const modules = _.pick(adminConfig, 'modules').modules;
    modules.map(function (module) {
        const code = module.code;//获取模块配置
        const items = model(code, module.schemas)//注册模型
        if (module.routes) moduleRoutes(code, module.routes);//注册模块声明路由，顺序先于模型路由是为了允许用户自定义重写默认的模型路由
        if (Object.keys(items).length > 0)modelRoutes(items, module);//模型默认路由
    });
    exports.configs = configs;

    //客户端入口配置
    app.use(adminConfig.route, function (req, res) {
        return res.sendFile(path.resolve(__dirname, '../client' + (process.env.NODE_ENV == 'production' ? '/' : '/build') + '/index.html'));
    });

    app.get('/adminConfig', function (req, res) {
        return res.json(configs);
    });
    exports.app = app;

};

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
function modelRoutes(moduleModels, module) {
    Object.keys(moduleModels).map(function (key) {
        if (!key || models[key]) return;
        models[key] = moduleModels[key];
        //TODO 模块名称不能用下划线
        const modelCode = key.substring(key.indexOf('_') + 1);
        //注册模型路由
        //TODO 模型路由默认验证删改操作，增查操作不做验证
        route(app, key, models[key], module.schemas[modelCode].auths || 'PUT,DELETE');
    });
}


/**
 * 获取model
 * @param code，格式为：模块编码_模型编码
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
/**
 * 导出验证工具模块
 */
exports.auth = auth;
/**
 * 导出Redis实例
 */
exports.redis = redis;
/**
 * 导出验证中间模块
 */
exports.authMiddleware = authMiddleware;