/**
 * 服务端配置项
 * Created by yinfxs on 16-6-19.
 */

'use strict';

const RouteUtils = require('./RouteUtils');

/**
 * 获取服务端配置项
 */
module.exports.initialize = async function initialize() {
    const result = await fetch(RouteUtils.ADMIN_CONFIG);

    module.exports.configs = result;
    console.log(result);
    return result;
};