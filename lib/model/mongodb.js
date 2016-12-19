/**
 * MongoDB适配器
 * Created by yinfxs on 16-10-4.
 */

'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const assign = require('object-assign');
const uuid = require('uuid');
const crypto = require('crypto');
const util = require('util');
const path = require('path');
const app = {};

const utility = require('../utils/utility');
const Schema = mongoose.Schema;

module.exports = app;

/**
 * 提取密码类型
 * @param fields
 * @returns {Array}
 */
const extractPassword = (fields) => {
    const codes = [];
    Object.keys(fields).forEach(function (code) {
        if (!code || fields[code].ctrltype !== 'password') return;
        codes.push(code);
    });
    return codes;
};


/**
 * 转换处理密码类型
 * 1.密码字段的加密处理
 * 2.添加虚拟属性
 * 3.添加验证密码的方法
 */
const transformPassword = (codes, schema) => {
    if (!codes) return schema;
    //密码的虚拟化处理
    codes.forEach(function (code) {
        if (!code) return;
        const firstUpperCode = utility.firstUpper(code);
        //1.密码字段的加密处理
        schema.methods['encrypt' + firstUpperCode] = function (password) {
            return crypto.createHmac('sha1', this[code + 'Salt']).update(password).digest('hex');
            //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
        };
        //2.添加虚拟属性
        schema.virtual(code)
            .set(function (password) {
                this['_plain' + firstUpperCode] = password;
                //产生密码盐：32位随机数+Base64编码
                this[code + 'Salt'] = crypto.randomBytes(32).toString('base64');
                this['hashed' + firstUpperCode] = this['encrypt' + firstUpperCode](password);
            })
            .get(function () {
                return this['_plain' + firstUpperCode];
            });
        //3.添加验证密码的方法
        schema.methods['verify' + firstUpperCode] = function (password) {
            return this['encrypt' + firstUpperCode](password) === this['hashed' + firstUpperCode];
        };
    });
    return schema;
};
/**
 * 转换处理subema控件类型的模型
 * @param fields
 * @returns {Array}
 */
const transformSubema = (fields) => {
    if (!fields) return fields;
    _.keys(fields).forEach((key) => {
        if (!key || !fields[key]) return;
        if (fields[key].ctrltype != 'subema' || !fields[key].subema) return;
        fields[key] = fields[key].subema;
    });
    return fields;
};

/**
 * 模型注册
 * @param module 所属模块对象
 * @param item 单个schema部分
 * @param models 模型搜集器
 */
app.schema = (module, item, models) => {
    const passwordCodes = extractPassword(item.fields);
    //给每个密码字段添加salt字段
    passwordCodes.forEach(function (passwordCode) {
        if (!passwordCode) return;
        item.fields[passwordCode + 'Salt'] = {
            type: String,
            required: true,
            ctrltype: 'password'
        };
        item.fields['hashed' + utility.firstUpper(passwordCode)] = {
            type: String,
            required: true,
            ctrltype: 'password'
        };
    });
    const schema = new Schema(transformSubema(_.omit(item.fields, passwordCodes)), item.options);
    transformPassword(passwordCodes, schema);
    if (_.isFunction(item.customSchema)) item.customSchema(schema);
    //TODO 模型的完整编码为：模块编码-模型编码
    const key = module.code + '-' + item.code;
    const value = mongoose.model(key, schema);
    //添加到模型搜集器
    models[key] = {
        type: 'mongodb',
        value: value,
        schema: item,
        mdlcode: module.code
    };
};


/**
 * 回调处理
 * @param callback 回调函数
 */
app.callback = function (callback) {
    if (_.isFunction(callback)) callback();
};