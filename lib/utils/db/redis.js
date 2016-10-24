/**
 * Redis配置信息
 * Created by yinfxs on 16-6-5.
 */


const Redis = require('ioredis');
const utility = require('../utility');
const i18n = require('../i18n');

/**
 * 初始化
 * @param constr
 * @returns {*}
 */
module.exports = function (constr) {
    var redis = new Redis(constr);
    redis.on('connect', function () {
        console.info(utility.time() + '：' + i18n.value('redis_success'));
    });
    redis.on('error', function (err) {
        console.error(i18n.value('redis_error', [err]));
    });
    redis.on('close', function () {
        console.info(i18n.value('redis_close'));
    });
    module.exports.instance = redis;
    return redis;
};
