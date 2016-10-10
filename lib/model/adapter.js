/**
 * 模型适配器
 * Created by yinfxs on 16-10-4.
 */

'use strict';

const utility = require('../utils/utility');
const mongodb = require('./mongodb');
const mssql = require('./mssql');


/**
 * 模型注册
 * @param ds 全局数据源
 * @param modules 模块配置部分
 * @param models 模型搜集器
 * @param callback 回调函数
 */
module.exports = function (ds, modules, models, callback) {
    modules.forEach(function (mdl) {
        if (!mdl) return;
        const moduleConfig = mdl.config || {};
        ds = moduleConfig.ds || ds;
        mdl.schemas.forEach(function (schema) {
            const schemaConfig = schema.config || {};
            ds = schemaConfig.ds || ds;
            switch (ds) {
                case 'mongodb':
                    mongodb.schema(mdl, schema, models);
                    break;
                case 'mssql':
                    mssql.schema(mdl, schema, models);
                    break;
                case 'mysql':
                    // mysql.schema(mdl, schema);
                    break;
            }
        });
    });
    mssql.callback(callback);
    mongodb.callback(callback);
};