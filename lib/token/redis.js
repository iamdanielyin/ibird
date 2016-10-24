/**
 * ibird授权及校验模块
 * Created by yinfxs on 16-6-5.
 */
'use strict';

const uuid = require('node-uuid');
const Redis = require('../utils/db/redis');
const _ = require('lodash');
const utility = require('../utils/utility');
const app = {};

var redis, authConfigs;
module.exports = app;

/**
 * 初始化
 * @param configs 授权配置信息
 * @returns {*}
 */
app.initialize = function (configs) {
    redis = Redis.instance;
    authConfigs = configs;
};

/**
 * 授权
 */
app.authorization = function (params = {}) {
    var content = {
        access_token: uuid.v1(),
        refresh_token: uuid.v1(),
        expires_in: authConfigs.expires_in
    };
    content = utility.joinObject(content, params);
    const encryptContent = new Buffer(JSON.stringify(content)).toString('base64');
    if (authConfigs.expires_in.access_token > 0) redis.set(content.access_token, encryptContent, 'ex', authConfigs.expires_in.access_token);
    else redis.set(content.access_token, encryptContent);
    if (authConfigs.expires_in.refresh_token > 0) redis.set(content.refresh_token, encryptContent, 'ex', authConfigs.expires_in.refresh_token);
    else redis.set(content.refresh_token, encryptContent);
    return content;
};

/**
 * 鉴权
 * @param access_token 访问token
 */
app.authentication = function (access_token, callback) {
    redis.get(access_token, function (err, result) {
        if (err || !result) return callback(err, result);
        return callback(err, JSON.parse(new Buffer(result, 'base64').toString()));
    });
};

/**
 * 刷新访问令牌
 * @param refresh_token
 */
app.refreshAccessToken = function (refresh_token, callback) {
    redis.get(refresh_token, function (err, result) {
        if (err || !result) return callback(err, result);
        const content = JSON.parse(new Buffer(result, 'base64').toString());
        content.access_token = uuid.v1();
        redis.set(content.access_token, new Buffer(JSON.stringify(content)).toString('base64'), 'ex', authConfigs.expires_in.access_token);
        callback(err, content);
    });
};
/**
 * 删除令牌
 * @param token 请求令牌|刷新令牌
 */
app.remove = function (token) {
    redis.get(token, function (err, result) {
        if (err || !result) return;
        const content = JSON.parse(new Buffer(result, 'base64').toString());
        redis.del(content.access_token);
        redis.del(content.refresh_token);
    });
};