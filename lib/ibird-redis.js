/**
 * Redis配置信息
 * Created by yinfxs on 16-6-5.
 */


const Redis = require('ioredis');
const moment = require('moment');

/**
 * 初始化
 * @param redisConnString
 * @returns {*}
 */
module.exports = function (redisConnString) {
    var redis = new Redis(redisConnString);
    redis.on('connect', function () {
        console.info(moment().format('llll') +'：Redis连接成功');
    });
    redis.on('error', function (err) {
        console.error('Redis异常:' + err);
    });
    redis.on('close', function () {
        console.info('Redis连接关闭');
    });
    module.exports.instance = redis;
    return redis;
};
