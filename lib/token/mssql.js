/**
 * ibird授权及校验模块 - SQLServer实现
 * Created by yinfxs on 16-6-5.
 */

'use strict';

const uuid = require('node-uuid');
const _ = require('lodash');
const mssql = require('../utils/db/mssql');
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
        expires_in_refresh: authConfigs.expires_in.refresh_token,
        data: JSON.stringify(params)
    };
    content = utility.joinObject(content, params);
    const table = 'preset_token';
    const command = `INSERT INTO ${table} (_id, access_token, refresh_token, expires_in_access, expires_in_refresh, data, ts, update_ts, dr) 
    VALUES ('${uuid.v1()}', '${content.access_token}', '${content.refresh_token}', '${content.expires_in_access}', '${content.expires_in_refresh}', '${content.data}', '${moment().format('x')}', '${moment().format('x')}', '0')`;
    //执行保存
    mssql.query(command);
    return content;
};

/**
 * 鉴权
 * @param access_token 访问token
 */
app.authentication = function (access_token, callback) {
    const table = 'preset_token';
    const command = `SELECT * FROM ${table} WHERE access_token='${access_token}' AND dr='0'`;
    mssql.query(command, function (rs) {
        let result = rs && rs.length > 0 ? rs[0] : null;
        if (!result) return callback({message: 'err'}, result);
        if (result.expires_in_access != 0 && utility.tsExpired(result.update_ts, result.expires_in_access)) return callback({message: 'Token expired'}, result);
        result = utility.joinObject(result, JSON.parse(result.data));
        return callback(null, result);
    }, err => callback(err, result));
};

/**
 * 刷新访问令牌
 * @param refresh_token
 */
app.refreshAccessToken = function (refresh_token, callback) {
    const table = 'preset_token';
    const command = `UPDATE ${table} SET  WHERE refresh_token = '${refresh_token}' AND dr == '0'`;
    mssql.query(command, function (rs) {
        const result = rs && rs.length > 0 ? rs[0] : null;
        if (!result) return callback({message: 'err'}, result);
        if (result.expires_in_refresh != 0 && utility.tsExpired(result.ts, result.expires_in_refresh)) return callback({message: 'Token expired'}, result);
        result.access_token = uuid.v1();
        result.update_ts = moment().format('x');
        const update = `UPDATE ${table} SET access_token='${result.access_token}',update_ts='${result.update_ts}' WHERE refresh_token='${refresh_token}' AND dr='0'`;
        mssql.query(update, function () {
            callback(null, result);
        }, function (err) {
            callback(err, result);
        });
    }, err => callback(err, result));
};
/**
 * 删除令牌
 * @param token 请求令牌|刷新令牌
 */
app.remove = function (token) {
    const table = 'preset_token';
    const command = `UPDATE ${table} SET dr='1' WHERE (refresh_token='${token}' OR access_token='${token}') AND dr='0'`;
    mssql.query(command, () => console.log('删除令牌成功!'), err => console.error('删除令牌异常：' + err));
};