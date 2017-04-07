/**
 * Redis配置信息
 * Created by yinfxs on 16-6-5.
 */


const Redis = require('ioredis');
const utility = require('../utility');
const i18n = require('../i18n');
const log = require('../log');
const logger = log(module);

/**
 * 初始化
 * @param constr
 * @returns {*}
 */
module.exports = function (constr) {
    var redis = new Redis(constr);
    redis.on('connect', function () {
        logger.info(utility.time() + '：' + i18n.value('redis_success'));
    });
    redis.on('error', function (err) {
        logger.error(i18n.value('redis_error', [err]));
    });
    redis.on('close', function () {
        logger.info(i18n.value('redis_close'));
    });
    module.exports.instance = redis;
    return redis;
};