'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const path = require('path');
const utility = require('ibird-utils');
const app = { auth: {} };

module.exports = app;

/**
 * 配置权限环境
 *
 * @param data 配置对象
 *
 */
app.config = (data = {}) => {
    if (typeof data !== 'object') return;
    for (const uid in data) {
        if (!uid || !Array.isArray(data[uid])) continue;
        app.auth[uid] = app.merge(data[uid]);
    }
    return app.auth;
};

/**
 * 合并指定的多个范围
 * @param range
 */
app.merge = (range) => {
    const result = { range: {}, permissions: [] };
    if (!Array.isArray(range) || range.length === 0) return result;
    for (const role of range) {
        if (typeof role.api !== 'object') continue;
        if (!Array.isArray(role.permissions) || role.permissions.length === 0) continue;
        //合并操作函数
        result.permissions = result.permissions.concat(role.permissions);
        //合并数据范围
        for (const code in role.api) {
            if (!code) continue;
            const _api = role.api[code];
            //合并所有条件
            if (!result.range[code]) {
                result.range[code] = _api;
            } else {
                const _range = result.range[code].$or ? result.range[code] : { $or: [result.range[code]] };
                _range.$or.push(_api);
                result.range[code] = _range;
            }
        }
    }
    result.permissions = utility.uniq(result.permissions);
    return result;
};

/**
 * 鉴权
 * @param unionid
 * @param permission
 */
app.authentication = (unionid, permission) => {
    if (Array.isArray(permission)) return batchAuth(unionid, permission);
    if (typeof unionid !== 'string' || typeof permission !== 'string') return { [permission]: false };
    const object = app.auth[unionid].permissions;
    if (Array.isArray(object) && object.indexOf(permission) < 0) return { [permission]: false };
    return { [permission]: true };
};

/**
 * 获取指定用户合并后的授权范围
 * @param unionid
 * @param [api]
 */
app.range = (unionid, api) => {
    if (!unionid || !app.auth[unionid]) return {};
    const result = app.auth[unionid];
    const range = result.range || {};
    return api ? range[api] : range;
};

/**
 * 获取指定用户合并后的权限列表
 * @param unionid
 */
app.permissions = (unionid) => {
    if (!unionid || !app.auth[unionid]) return [];
    const result = app.auth[unionid] || {};
    return result.permissions || [];
};

/**
 * 批量鉴权
 * @param unionid
 * @param permissions
 */
function batchAuth(unionid, permissions) {
    if (!Array.isArray(permissions)) return { [permission]: false };
    const result = {};
    for (const permission of permissions) {
        if (permission == null || typeof permission !== 'string') continue;
        Object.assign(result, app.authentication(unionid, permission));
    }
    return result;
}

/**
 * 导出中间件
 * @param app
 */
app.middleware = (app) => {
    app.use(require('./middleware/auth'));
};

/**
 * 导出内置路由
 * @param app
 */
app.route = (router) => {
    router.get('/permissions', require('./route/authentication'));
    router.post('/authentication', require('./route/permissions'));
};