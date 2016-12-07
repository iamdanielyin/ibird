/**
 * 授权适配器
 * Created by yinfxs on 16-10-19.
 */

'use strict';


'use strict';

const uuid = require('uuid');
const _ = require('lodash');

const mongodb = require('./mongodb');
const redis = require('./redis');
const mssql = require('./mssql');
const app = {};

var ds;

module.exports = app;
/**
 * 初始化
 * @param dataSource 数据库类型
 * @param configs 授权配置信息
 * @returns {*}
 */
app.initialize = function (dataSource, configs) {
    ds = dataSource;
    configs = configs || {
            "expires_in": {
                "access_token": 7 * 24 * 60 * 60,//access_token过期时间，单位秒，0表示永久不过起
                "refresh_token": 0//refresh_token过期时间，单位秒，0表示永久不过起
            }
        };
    switch (ds) {
        case 'mongodb':
            mongodb.initialize(configs);
            break;
        case 'redis':
            redis.initialize(configs);
            break;
        case 'mssql':
            mssql.initialize(configs);
            break;
        case 'mysql':
            break;
    }
};

/**
 * 授权
 */
app.authorization = function (params = {}) {
    var content = null;
    switch (ds) {
        case 'mongodb':
            content = mongodb.authorization(params);
            break;
        case 'redis':
            content = redis.authorization(params);
            break;
        case 'mssql':
            content = mssql.authorization(params);
            break;
        case 'mysql':
            break;
    }
    return content;
};

/**
 * 鉴权
 * @param access_token 访问token
 */
app.authentication = function (access_token, callback) {
    switch (ds) {
        case 'mongodb':
            mongodb.authentication(access_token, callback);
            break;
        case 'redis':
            redis.authentication(access_token, callback);
            break;
        case 'mssql':
            mssql.authentication(access_token, callback);
            break;
        case 'mysql':
            break;
    }
};

/**
 * 刷新访问令牌
 * @param refresh_token
 */
app.refreshAccessToken = function (refresh_token) {
    switch (ds) {
        case 'mongodb':
            mongodb.refreshAccessToken(refresh_token);
            break;
        case 'mssql':
            mssql.refreshAccessToken(refresh_token);
            break;
        case 'redis':
            redis.refreshAccessToken(refresh_token);
            break;
        case 'mysql':
            break;
    }
};
/**
 * 删除令牌
 * @param token 请求令牌|刷新令牌
 */
app.remove = function (token) {
    switch (ds) {
        case 'mongodb':
            mongodb.remove(token);
            break;
        case 'mssql':
            mssql.remove(token);
            break;
        case 'redis':
            redis.remove(token);
            break;
        case 'mysql':
            break;
    }
};