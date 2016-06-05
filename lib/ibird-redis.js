/**
 * Redis配置信息
 * Created by yinfxs on 16-6-5.
 */


const Redis = require('ioredis');

/**
 * 初始化
 * @param redisConnString
 * @returns {*}
 */
module.exports = function (redisConnString) {
    var redis = new Redis(redisConnString);
    redis.on('connect', function () {
        console.log('Redis连接成功');
    });
    redis.on('error', function (err) {
        console.log('Redis异常:' + err);
    });
    redis.on('close', function () {
        console.log('Redis连接关闭');
    });
    module.exports.instance = redis;
    return redis;
};
