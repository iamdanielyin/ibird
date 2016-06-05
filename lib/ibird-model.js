/**
 * Mongoose模型注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const _ = require('underscore');
const mongoose = require('mongoose');
const crypto = require('crypto');
const util = require('util');
const path = require('path');

const utility = require('./utility');
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
        const passwordCodes = filterPasswordInputType(config.obj);
        //给每个密码字段添加salt字段
        passwordCodes.map(function (passwordCode) {
            if (!passwordCode) return;
            config.obj[passwordCode + 'Salt'] = {type: String, required: true};
        });
        let schema = new Schema(_.omit(config.obj, passwordCodes), config.options);
        schema = processPasswordInputType(config.obj, passwordCodes, schema);
        if (_.isFunction(config.customSchema)) schema = config.customSchema(schema);
        const key = moduleCode + '_' + code;

        models[key] = mongoose.model(key, schema);
    });
    return models;
}

/**
 * 过滤密码类型
 */
function filterPasswordInputType(obj) {
    const codes = [];
    Object.keys(obj).map(function (code) {
        if (!code || !obj[code].inputType === 'password') return;
        codes.push(code);
    });
    return codes;
}

/**
 * 处理密码类型
 * 1.密码字段的加密处理
 * 2.添加虚拟属性
 * 3.添加验证密码的方法
 */
function processPasswordInputType(obj, passwordCodes, schema) {
    //密码的虚拟化处理
    passwordCodes.map(function (code) {
        if (!code) return;
        const firstUpperCode = utility.firstUpper(code);
        //1.密码字段的加密处理
        schema.methods['encrypt' + firstUpperCode] = function (password) {
            return crypto.createHmac('sha1', this[code + 'Salt']).update(password).digest('hex');
            //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
        };
        //2.添加虚拟属性
        schema.virtual('password')
            .set(function (password) {
                //产生密码盐：32位随机数+Base64编码
                this[code + 'Salt'] = crypto.randomBytes(32).toString('base64');
                this[code] = this.encryptPassword(password);
            })
            .get(function () {
                return this[code];
            });
        //3.添加验证密码的方法
        schema.methods.verifyPassword = function (password) {
            return this['encrypt' + firstUpperCode](password) === this[code];
        };
    });
    return schema;
}

module.exports = registerModels;