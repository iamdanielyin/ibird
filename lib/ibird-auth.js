/**
 * ibird授权及校验模块
 * Created by yinfxs on 16-6-5.
 */
'use strict';

const uuid = require('node-uuid');
const Redis = require('./ibird-redis');
const _ = require('underscore');

var redis, authConfigs;

/**
 * 初始化
 * @param configs 授权配置信息
 * @returns {*}
 */
module.exports.initialize = function (configs) {
    redis = Redis.instance;
    authConfigs = configs;
};

/**
 * 授权
 */
module.exports.authorization = function () {
    const content = {
        access_token: uuid.v1(),
        refresh_token: uuid.v1(),
        expires_in: authConfigs.expires_in
    };
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
module.exports.authentication = function (access_token, callback) {
    redis.get(access_token, function (err, result) {
        if (err || !result) return callback(err, result);
        return callback(err, JSON.parse(new Buffer(result, 'base64').toString()));
    });
};

/**
 * 刷新访问令牌
 * @param refresh_token
 */
module.exports.refreshAccessToken = function (refresh_token) {
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
module.exports.remove = function (token) {
    redis.get(token, function (err, result) {
        if (err || !result) return;
        const content = JSON.parse(new Buffer(result, 'base64').toString());
        redis.del(content.access_token);
        redis.del(content.refresh_token);
    });
};