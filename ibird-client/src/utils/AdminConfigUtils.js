/**
 * 服务端配置项
 * Created by yinfxs on 16-6-19.
 */

'use strict';

const RouteUtils = require('./RouteUtils');

/**
 * 获取服务端配置项
 */
module.exports.initialize = function initialize() {
    const result = fetch(RouteUtils.ADMIN_CONFIG);
    const json = result.json();
    module.exports.configs = json;
    return json;
};