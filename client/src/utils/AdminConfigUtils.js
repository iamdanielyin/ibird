/**
 * 服务端配置项
 * Created by yinfxs on 16-6-19.
 */

'use strict';

const RouteUtils = require('./RouteUtils');

/**
 * 获取服务端配置项
 */
module.exports.initialize = function (callback) {
    fetch(RouteUtils.ADMIN_CONFIG).then(function (res) {
        res.json().then(function (json) {
            module.exports.configs = json;
            callback(module.exports.configs);
        });
    });
};