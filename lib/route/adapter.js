/**
 * 模型路由注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const _ = require('lodash');
const multipart = require('connect-multiparty');
const mongoose = require('mongoose');
const tokenmdl = require('../middleware/tokenmdl');
const authmdl = require('../middleware/authmdl');
const transmdl = require('../middleware/transmdl');
const scopemdl = require('../middleware/scopemdl');
const i18n = require('../utils/i18n');
const mongodb = require('./mongodb');
const mssql = require('./mssql');
const log = require('../utils/log')(module);


/**
 * 生成模型key和鉴权声明的对应对象
 * @param modules 模块配置部分
 * @returns {{}}
 */
function tokensKeyObject(modules) {
    const object = {};
    modules.forEach(function (module) {
        module.schemas.forEach(function (schema) {
            if (!schema) return;
            //TODO 模型的完整编码为：模块编码-模型编码
            object[module.code + '-' + schema.code] = schema.tokens || 'PUT,DELETE';//TODO 模型路由默认验证删改操作，增查操作不做验证
        });
    });
    return object;
}

/**
 * 设置自动更新值
 */
function defaultValue(schema, doc, req) {
    if (!schema || !schema.fields || !doc) return doc;
    if (_.isArray(doc)) {
        doc.forEach((item) => {
            if (!item) return;
            defaultValue(schema, item);
        });
        return;
    }
    const fields = schema.fields;
    _.keys(fields).forEach((key) => {
        if (!key || !fields[key].default || doc[key]) return;
        const field = fields[key];
        const defaults = field.default;
        doc[key] = _.isFunction(defaults) ? defaults() : defaults;
    });
    //设置创建人、更新人
    const token = req.access_token || {};
    doc.creater = doc.creater || token._id;
    doc.modifier = doc.modifier || token._id;
    return doc;
}
/**
 * 设置自动更新值
 */
function defaultUpdatedValue(schema, doc, req) {
    if (!schema || !schema.fields || !doc) return doc;
    const fields = schema.fields;
    _.keys(fields).forEach((key) => {
        if (!key || !fields[key].updated || doc[key]) return;
        const field = fields[key];
        const updated = field.updated;
        doc[key] = _.isFunction(updated) ? updated() : updated;
    });
    //设置更新人
    const token = req.access_token || {};
    doc.modifier = token._id;
    return doc;
}
/**
 * 注册模型默认路由：增删改查
 * @param app Express应用实例
 * @param modules 模块配置部分
 * @param models 模型搜集器
 * @param ruprefix 接口前缀
 * @param uploadmdl 文件上传中间件
 * @param callback 回调函数
 */
module.exports = function registerRoutes(app, modules, models, ruprefix = '', uploadmdl, callback) {
    const tokens = tokensKeyObject(modules);
    // const modelNames = mongoose.modelNames() || [];
    _.keys(models).forEach(function (key) {
        //注册模型路由
        if (!models[key] || !models[key].type) return;
        const tokenstr = tokens[key];

        //TODO 模型的完整编码为：模块编码-模型编码
        const splitIndex = key.indexOf('-');
        const moduleCode = key.substring(0, splitIndex);
        const modelCode = key.substring(splitIndex + 1);
        const methods = tokenstr ? tokenstr.toUpperCase().split(',') : [];
        //默认鉴权
        app.all(ruprefix + '/' + moduleCode + '/' + modelCode, transmdl, (req, res, next) => {
            // console.log(JSON.stringify(req.access_token, null, 2));
            const auths = models[key].schema.auths;
            req.auths = _.isBoolean(auths) ? auths : true;
            req.moduleCode = moduleCode;
            req.modelCode = modelCode;
            if (methods.length == 0) return next('route');//不作任何验证直接进到模型操作路由
            return (methods.indexOf(req.method) != -1) ? next() : next('route');//存在验证时，进入验证中间件，否则进入操作路由
        }, tokenmdl);

        const type = models[key].type;
        const object = {
            Model: type == 'mongodb' ? mongoose.model(key) : null,
            table: models[key].value,
            schema: models[key].schema,
            modelCode: modelCode,
            moduleCode: moduleCode
        };

        app.post(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res, next) {
            req.actid = 'create';
            next();
        }, authmdl, function (req, res) {
            defaultValue(object.schema, req.body, req);
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
        app.delete(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res, next) {
            req.actid = 'delete';
            next();
        }, authmdl, function (req, res) {
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
        app.put(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res, next) {
            req.actid = 'update';
            next();
        }, authmdl, function (req, res) {
            req.body.doc = _.omit(req.body.doc, '_id');
            defaultUpdatedValue(object.schema, req.body.doc, req);
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
        app.get(ruprefix + '/' + moduleCode + '/' + modelCode, function (req, res, next) {
            req.actid = 'list';
            next();
        }, authmdl, scopemdl, function (req, res) {
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
        app.get(ruprefix + '/' + moduleCode + '/' + modelCode + '/:id', function (req, res, next) {
            req.actid = 'one';
            next();
        }, authmdl, function (req, res) {
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
        app.post(ruprefix + '/' + moduleCode + '/' + modelCode + '/data/import', function (req, res, next) {
            req.actid = 'import';
            next();
        }, authmdl, uploadmdl, function (req, res) {
            switch (type) {
                case 'mongodb':
                    mongodb.import(object, req, res);
                    break;
                case 'mssql':
                    mssql.import(object, req, res);
                    break;
                case 'mysql':
                    break;
            }
        });
        app.post(ruprefix + '/' + moduleCode + '/' + modelCode + '/data/export', function (req, res, next) {
            req.actid = 'export';
            next();
        }, authmdl, function (req, res) {
            switch (type) {
                case 'mongodb':
                    mongodb.export(object, req, res);
                    break;
                case 'mssql':
                    mssql.export(object, req, res);
                    break;
                case 'mysql':
                    break;
            }
        });
    });
    if (_.isFunction(callback)) callback();
};