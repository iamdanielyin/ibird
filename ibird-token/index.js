'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const path = require('path');
const uuid = require('uuid');
const utility = require('ibird-utils');
const fs = require('fs-extra');
const Redis = require('./utils/redis');
const moment = require('moment');
moment.locale('zh-cn');

const app = { mode: 1 };
const cache = {
    mode: 1, expires_in: {
        access_token: 86400, // 默认一天，1天
        refresh_token: 604800 // 默认一周，7天
    }
};

module.exports = app;

/**
 * 内存模式
 * @type {number}
 */
app.MODE_MEMORY = 1;

/**
 * Redis模式
 * @type {number}
 */
app.MODE_REDIS = 2;

/**
 * 自定义模式
 * @type {number}
 */
app.MODE_USER = 3;

/**
 * 访问令牌的Key
 * @type {string}
 */
app.TOKENKEY = 'access_token';

/**
 * 访问令牌在Cookie中的Key
 * @type {string}
 */
app.COOKIETOKEN = `IBIRD_${app.TOKENKEY}`.toUpperCase();

/**
 * 用户ID在Cookie中的Key
 * @type {string}
 */
app.COOKIEUSERID = `IBIRD_USERID`;

/**
 * 初始化配置
 *
 * @param obj 配置对象
 *
 */
app.config = (obj = {}) => {
    cache.mode = [app.MODE_USER, app.MODE_MEMORY, app.MODE_REDIS].indexOf(obj.mode) >= 0 ? obj.mode : app.MODE_MEMORY;
    const expires_in = obj.expires_in || {};
    cache.expires_in = (typeof expires_in.access_token === 'number') && (typeof expires_in.refresh_token === 'number') ? expires_in : cache.expires_in;
    cache.expires_in.access_token = Math.abs(cache.expires_in.access_token);
    cache.expires_in.refresh_token = Math.abs(cache.expires_in.refresh_token);

    if (app.taskInterval) clearInterval(app.taskInterval);
    switch (cache.mode) {
        case app.MODE_MEMORY:
            cache.token = { access_token: {}, refresh_token: {} };
            app.taskfn();
            break;
        case app.MODE_REDIS:
            if (!obj.redis) throw new Error(`Redis模式下必须提供Redis的连接参数（redis）`);
            const redis = Redis(obj.redis);
            app.redis = redis;
            cache.redis = redis;
            break;
        case app.MODE_USER:
            if (!obj.token || (typeof obj.get !== 'function') || (typeof obj.set !== 'function') || (typeof obj.remove !== 'function') || (typeof obj.refresh !== 'function')) {
                throw new Error(`自定义模式下必须提供令牌的设置／获取／删除／刷新函数（get、set、remove、refresh）`);
            }
            cache.set = obj.set;
            cache.get = obj.get;
            cache.remove = obj.remove;
            cache.refresh = obj.refresh;
            break;
    }
    app.mode = cache.mode;
    app.user = obj.user;
    app.ignoreURLs = obj.ignoreURLs;
};

/**
 * 授权
 * @param condition
 * @param [data]
 */
app.authorization = async (condition, data) => {
    if ((typeof condition !== 'function') && (typeof condition !== 'boolean')) throw Error(`授权条件必须是函数或布尔类型`);
    try {
        if (typeof condition === 'function') {
            await condition();
        } else {
            if (!condition) throw new Error('未满足授权条件');
        }
        const time = moment().unix();
        const token = {
            access_token: uuid.v1().replace(/-/g, ''),
            refresh_token: new Buffer(uuid.v1()).toString('base64'),
            expires_in: {
                access_token: cache.expires_in.access_token,
                refresh_token: cache.expires_in.refresh_token
            },
            created: time,
            updated: time,
            data
        };
        switch (cache.mode) {
            case app.MODE_MEMORY:
                cache.token.access_token[token.access_token] = token;
                cache.token.refresh_token[token.refresh_token] = token;
                break;
            case app.MODE_REDIS:
                await app.redis.pipeline()
                .set(token.access_token, JSON.stringify(token, null, 0), 'EX', token.expires_in.access_token)
                .set(token.refresh_token, JSON.stringify(token, null, 0), 'EX', token.expires_in.refresh_token)
                .exec();
                break;
            case app.MODE_USER:
                await cache.set(token);
                break;
        }
        return Promise.resolve(token);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * 鉴权
 * @param access_token
 */
app.authentication = async (access_token) => {
    let token = null;
    try {
        switch (cache.mode) {
            case app.MODE_MEMORY:
                const access_cache = cache.token.access_token;
                token = access_cache[access_token];
                if (token) return token;
                break;
            case app.MODE_REDIS:
                token = await app.redis.get(access_token);
                if (token) {
                    token = utility.parse(token);
                    return token;
                }
                break;
            case app.MODE_USER:
                token = await cache.get(access_token);
                if (token) {
                    const expires_in = token.expires_in;
                    const access_expires = moment(token.created, 'X').add(expires_in.access_token, 's');
                    if (moment().isBefore(access_expires)) return token;
                }
                break;
        }
        throw new Error(`令牌已失效`);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * 通过刷新令牌刷新访问令牌
 * @param refresh_token
 */
app.refresh = async (refresh_token) => {
    if (!refresh_token) return Promise.reject(new Error(`参数异常（refresh_token）`));
    let token = null;
    try {
        switch (cache.mode) {
            case app.MODE_MEMORY:
                const access_cache = cache.token.access_token;
                const refresh_cache = cache.token.refresh_token;
                token = refresh_cache[refresh_token];
                if (!token) throw new Error(`刷新令牌已过期`);

                token.updated = moment().unix();
                token.access_token = uuid.v1().replace(/-/g, '');
                access_cache[token.access_token] = token;
                refresh_cache[token.refresh_token] = token;

                cache.token = {
                    access_token: access_cache,
                    refresh_token: refresh_cache
                };
                break;
            case app.MODE_REDIS:
                token = await app.redis.get(refresh_token);
                if (!token) throw new Error(`刷新令牌已过期`);
                token = utility.parse(token);

                token.updated = moment().unix();
                token.access_token = uuid.v1();

                await app.redis.pipeline()
                .set(token.access_token, JSON.stringify(token, null, 0), 'EX', token.expires_in.access_token)
                .set(token.refresh_token, JSON.stringify(token, null, 0), 'EX', token.expires_in.refresh_token)
                .exec();
                break;
            case app.MODE_USER:
                token = await cache.refresh(refresh_token);
                break;
        }
        return Promise.resolve(token);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * 立即删除令牌
 * @param access_token，访问令牌
 */
app.remove = async (access_token) => {
    if (!access_token || !cache.mode) return;
    let token = null;
    try {
        switch (cache.mode) {
            case app.MODE_MEMORY:
                const access_cache = cache.token.access_token;
                const refresh_cache = cache.token.refresh_token;
                token = access_cache[access_token];
                if (!token) return;
                cache.token = {
                    access_token: utility.omit(access_cache, token.access_token),
                    refresh_token: utility.omit(refresh_cache, token.refresh_token)
                };
                break;
            case app.MODE_REDIS:
                token = await app.redis.get(access_token);
                if (!token) return;
                await app.redis.pipeline().del(token.access_token).del(token.refresh_token).exec();
                break;
            case app.MODE_USER:
                await cache.remove(access_token);
                break;
        }
    } catch (e) {
        return;
    }
};

/**
 * 内存模式的自动更新任务
 */
app.taskfn = () => {
    app.taskInterval = setInterval(() => {
        if (app.mode != app.MODE_MEMORY) return;
        if (Object.keys(cache.token.access_token) == 0) return;

        const access_cache = {};
        const refresh_cache = {};

        const _access = cache.token.access_token;
        const _refresh = cache.token.refresh_token;
        const now = moment();
        for (const access_token in _access) {

            const token = _access[access_token] || {};

            const access_expires = moment(token.updated, 'X').add(token.expires_in.access_token, 's');
            if (now.isBefore(access_expires)) access_cache[token.access_token] = token;
        }
        for (const refresh_token in _refresh) {

            const token = _refresh[refresh_token] || {};

            const refresh_expires = moment(token.created, 'X').add(token.expires_in.refresh_token, 's');
            if (now.isBefore(refresh_expires)) refresh_cache[token.refresh_token] = token;
        }
        cache.token = {
            access_token: access_cache,
            refresh_token: refresh_cache
        };
    }, 1500);
};

/**
 * 自动配置
 */
app.config();

/**
 * 导出中间件
 * @param app
 */
app.middleware = (app) => {
    require('./middleware/token')(app);
};

/**
 * 导出内置路由
 * @param app
 */
app.route = (router) => {
    require('./route/refresh')(router);
    require('./route/signin')(router);
    require('./route/signout')(router);
    require('./route/validity')(router);
};