'use strict';

/**
 * Redis配置信息
 * Created by yinfxs on 16-6-5.
 */

const Redis = require('ioredis');
const moment = require('moment');

const cache = {};

module.exports = (config) => {
    if (!config) return cache.redis;
    const redis = new Redis(config);
    redis.on('connect', () => {
        console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}：Redis连接成功！`);
    });
    redis.on('error', e => {
        console.error(`Redis连接异常：${e.message}`);
    });
    redis.on('close', () => {
        console.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}：Redis连接断开！`);
    });
    redis.on('reconnecting', (ms) => {
        console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}：Redis断开${(ms / 1000).toFixed(2)}秒后重连！`);
    });
    redis.on('end', (e) => {
        console.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}：Redis连接关闭！`);
    });
    cache.redis = redis;
    return redis;
};