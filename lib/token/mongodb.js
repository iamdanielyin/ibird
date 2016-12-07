/**
 * ibird授权及校验模块 - MongoDB实现
 * Created by yinfxs on 16-6-5.
 */

'use strict';

const uuid = require('uuid');
const _ = require('lodash');
const mongoose = require('mongoose');
const moment = require('moment');
const utility = require('../utils/utility');
const app = {};

var authConfigs;
module.exports = app;

/**
 * 初始化
 * @param configs 授权配置信息
 * @returns {*}
 */
app.initialize = function (configs) {
    authConfigs = configs;
};

/**
 * 授权
 */
app.authorization = function (params = {}) {
    let content = {
        access_token: uuid.v1(),
        refresh_token: uuid.v1(),
        expires_in_access: authConfigs.expires_in.access_token,
        expires_in_refresh: authConfigs.expires_in.access_token,
        data: JSON.stringify(params)
    };
    const Token = mongoose.model('preset-token');
    const object = new Token(content);
    object.save();
    content = utility.joinObject(content, params);
    return content;
};

/**
 * 鉴权
 * @param access_token 访问token
 */
app.authentication = function (access_token, callback) {
    const Token = mongoose.model('preset-token');
    Token.findOne({access_token: access_token, dr: '0'}, function (err, result) {
        if (err || !result || !result.ts) return callback(err, result);
        if (result.expires_in_access != 0 && utility.tsExpired(result.ts, result.expires_in_access)) return callback({message: 'Token expired'}, result);
        result = utility.joinObject(result, JSON.parse(result.data));
        return callback(err, result);
    });
};

/**
 * 刷新访问令牌
 * @param refresh_token
 */
app.refreshAccessToken = function (refresh_token, callback) {
    const Token = mongoose.model('preset-token');
    Token.findOne({refresh_token: refresh_token}, function (err, result) {
        if (err || !result) return callback(err, result);
        if (result.expires_in_refresh != 0 && utility.tsExpired(result.ts, result.expires_in_refresh)) return callback({message: 'Token expired'}, result);
        result.access_token = uuid.v1();
        result.ts = moment().format('x');
        result.save();
        callback(err, result);
    });
};
/**
 * 删除令牌
 * @param token 请求令牌|刷新令牌
 */
app.remove = function (token) {
    const Token = mongoose.model('preset-token');
    Token.findOne({$or: [{access_token: token}, {refresh_token: token}]}, function (err, result) {
        if (err || !result) return;
        result.dr = '1';
        result.save();
    });
};