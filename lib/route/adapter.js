/**
 * 模型路由注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const _ = require('underscore');
const mongoose = require('mongoose');
const authmdl = require('../middleware/authmdl');
const i18n = require('../utils/i18n');
const mongodb = require('./mongodb');
const mssql = require('./mssql');
const log = require('../utils/log')(module);


/**
 * 生成模型key和鉴权声明的对应对象
 * @param modules 模块配置部分
 * @returns {{}}
 */
function authsKeyObject(modules) {
    const object = {};
    modules.forEach(function (module) {
        module.schemas.forEach(function (schema) {
            if (!schema) return;
            //TODO 模型的完整编码为：模块编码-模型编码
            object[module.code + '-' + schema.code] = schema.auths || 'PUT,DELETE';//TODO 模型路由默认验证删改操作，增查操作不做验证
        });
    });
    return object;
}
/**
 * 注册模型默认路由：增删改查
 * @param app Express应用实例
 * @param modules 模块配置部分
 * @param models 模型搜集器
 * @param ruprefix 接口前缀
 * @param callback 回调函数
 */
module.exports = function registerRoutes(app, modules, models, ruprefix = '', callback) {
    const auths = authsKeyObject(modules);
    // const modelNames = mongoose.modelNames() || [];
    _.keys(models).forEach(function (key) {
        //注册模型路由
        if (!models[key] || !models[key].type) return;
        const authstr = auths[key];

        //TODO 模型的完整编码为：模块编码-模型编码
        const splitIndex = key.indexOf('-');
        const moduleCode = key.substring(0, splitIndex);
        const modelCode = key.substring(splitIndex + 1);
        const methods = authstr ? authstr.toUpperCase().split(',') : [];
        //默认鉴权
        app.all(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res, next) {
            if (methods.length == 0) return next('route');//不作任何验证直接进到模型操作路由
            return (methods.indexOf(req.method) != -1) ? next() : next('route');//存在验证时，进入验证中间件，否则进入操作路由
        }, authmdl);

        const type = models[key].type;
        const object = {
            Model: type == 'mongodb' ? mongoose.model(key) : null,
            table: models[key].value,
            schema: models[key].schema,
            modelCode: modelCode,
            moduleCode: moduleCode
        };

        app.post(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res) {
            switch (type) {
                case 'mongodb':
                    mongodb.create(object, req, res);
                    break;
                case 'mssql':
                    mssql.create(object, req, res);
                    break;
                case 'mysql':
                    break;
            }
        });
        app.delete(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res) {
            switch (type) {
                case 'mongodb':
                    mongodb.delete(object, req, res);
                    break;
                case 'mssql':
                    mssql.delete(object, req, res);
                    break;
                case 'mysql':
                    break;
            }
        });
        app.put(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res) {
            //TODO 过滤特殊字段，以防特殊字段被修改覆盖
            switch (type) {
                case 'mongodb':
                    mongodb.update(object, req, res);
                    break;
                case 'mssql':
                    mssql.update(object, req, res);
                    break;
                case 'mysql':
                    break;
            }
        });
        app.get(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res) {
            switch (type) {
                case 'mongodb':
                    mongodb.list(object, req, res);
                    break;
                case 'mssql':
                    mssql.list(object, req, res);
                    break;
                case 'mysql':
                    break;
            }
        });
        app.get(ruprefix + '/' + moduleCode + '/' + modelCode + '/:id', function (req, res) {
            switch (type) {
                case 'mongodb':
                    mongodb.one(object, req, res);
                    break;
                case 'mssql':
                    mssql.one(object, req, res);
                    break;
                case 'mysql':
                    break;
            }
        });
    });
    if (_.isFunction(callback)) callback();
};