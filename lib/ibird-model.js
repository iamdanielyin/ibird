/**
 * Mongoose模型注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const _ = require('underscore');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 模型注册
 * @param moduleCode 模块编码
 * @param schemasConfig 配置文件的schemas部分
 * @returns {Array} 模型
 */
function registerModels(moduleCode, schemasConfig) {
    const schemas = schemasConfig;
    const models = {};
    let keys = Object.keys(schemas);
    keys.map(function (code) {
        const config = schemas[code];
        let schema = new Schema(config.obj, config.options);
        schema = config.customSchema(schema);
        const key = moduleCode + '_' + code;
        models[key] = mongoose.model(key, schema);
    });
    return models;
}

exports = module.exports = registerModels;
