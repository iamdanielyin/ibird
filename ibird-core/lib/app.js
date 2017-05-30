'use strict';


/**
 * 应用主模块
 * The main module.
 * Created by yinfxs on 2017/4/5.
 */


const app = {};
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const mongoose = require('mongoose');
const utility = require('ibird-utils');
const mongo = require('./mongo');
const config = require('./config');
const koa = require('./koa');

moment.locale('zh-cn');

module.exports = app;

/**
 * 对于config的简写调用
 */
app.c = config;

/**
 * 输出日志对象
 * @type {null}
 */
app.logger = config.logger;

/**
 * 输出国际化对象
 * @type {null}
 */
app.i18n = config.i18n;

/**
 * 配置项注册
 * @param key
 * @param value
 */
app.config = (key, value) => {
    if ((typeof key !== 'string') && (typeof key !== 'object')) return config;
    if (typeof key === 'string') {
        config[key] = value;
    } else {
        Object.assign(config, key);
    }
    config.trigger.emit('ibird_config_success', key, value, config);
};

/**
 * 模型注册
 * @param name 模型标记，需保证全局唯一，否则可能被覆盖
 * @param displayName 模型显示名称
 * @param schema 模型描述对象
 * @param collection 集合名称
 * @param skipInit 是否跳过初始化
 */
app.model = (obj) => {
    if (typeof obj !== 'object') return;
    if (Array.isArray(obj)) return batchModel(obj);
    const { name, schema, collection, skipInit } = obj;
    if (!name || !schema) return;

    config.model = (typeof config.model === 'object') && !Array.isArray(config.model) ? config.model : {};
    config.schema = (typeof config.schema === 'object') && !Array.isArray(config.model) ? config.schema : {};

    if (typeof name === 'string' && !schema) return config.model[name];
    const Model = mongoose.model(name, schema, collection, skipInit);
    config.model[name] = Model;
    config.schema[name] = obj;
    config.trigger.emit('ibird_model_success', name, Object.assign(obj, { Model: Model }), config);
    return Model;
};

/**
 * 批量模型注册
 * @param data
 */
function batchModel(data) {
    if (!data) return;
    data = Array.isArray(data) ? data : [data];
    if (data.length == 0) return;
    for (const item of data) {
        if (!item || typeof item !== 'object') continue;
        app.model(item);
    }
}

/**
 * 挂载路由
 * @param fn 自定义函数
 */
app.mount = (fn) => {
    if (Array.isArray(fn)) return batchMount(fn);
    if (typeof fn !== 'function') return;
    config.route = Array.isArray(config.route) ? config.route : [];
    config.route.push(fn);
};

/**
 * 批量挂载路由
 * @param array
 */
function batchMount(array) {
    if (!array) return;
    array = Array.isArray(array) ? array : [array];
    if (array.length == 0) return;
    for (const item of array) {
        if (item === null || typeof item !== 'function') continue;
        app.mount(item);
    }
}
/**
 * 挂载中间件
 * @param middleware 自定义中间件
 */
app.use = (middleware) => {
    if (Array.isArray(middleware)) return batchUse(middleware);
    if (typeof middleware !== 'function') return;
    config.middleware = Array.isArray(config.middleware) ? config.middleware : [];
    config.middleware.push(middleware);
};

/**
 * 批量挂载中间件
 * @param array
 */
function batchUse(array) {
    if (!array) return;
    array = Array.isArray(array) ? array : [array];
    if (array.length == 0) return;
    for (const item of array) {
        if (item === null || typeof item !== 'function') continue;
        app.use(item);
    }
}

/**
 * 引用插件
 * @param model 模型部分
 * @param middleware 中间件部分
 * @param route 自定义路由部分
 */
app.import = ({ model, middleware, route }) => {
    if (model && typeof model === 'object') {
        for (const key in model) {
            const item = model[key];
            if (typeof item !== 'object') continue;
            app.model(item);
        }
    }
    if (middleware && typeof middleware === 'function') app.use(middleware);
    if (route && typeof route === 'function') app.mount(route);
};

/**
 * 挂载模型文件夹
 * 将会递归挂载该文件夹下的所有文件
 * @param dir
 */
app.modelDir = (dir) => {
    app.recursiveDir(dir, app.model);
};

/**
 * 挂载路由文件夹
 * 将会递归挂载该文件夹下的所有文件
 * @param dir
 */
app.mountDir = (dir) => {
    app.recursiveDir(dir, app.mount);
};

/**
 * 挂载中间件文件夹
 * 将会递归挂载该文件夹下的所有文件
 * @param dir
 */
app.useDir = (dir) => {
    app.recursiveDir(dir, app.use);
};

/**
 * 递归文件夹，并对所有js文件执行回调
 * @param dir
 * @param callback
 */
app.recursiveDir = (dir, callback) => {
    setTimeout(() => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullpath = path.resolve(dir, file);
            const stat = fs.statSync(fullpath);
            if (stat.isFile() === false && stat.isDirectory() === false) continue;
            if (stat.isDirectory()) {
                app.recursiveDir(fullpath, callback);
                continue;
            }
            const parse = path.parse(fullpath);
            if (!parse || parse.ext !== '.js') continue;
            if (typeof callback === 'function') callback(require(fullpath));
        }
    }, 1);
};

/**
 * 启动应用
 * @returns {Promise.<void>}
 */
app.start = async () => {
    await mongo(config.mongo);
    return koa.run();
};