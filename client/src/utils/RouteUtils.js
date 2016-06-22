/**
 * 路由地址定义
 * Created by yinfxs on 16-6-19.
 */

'use strict';

const prefix = location.protocol + '//' + location.host;

module.exports = {
    CONFIG_PUBLIC: prefix + '/config/public',
    CONFIG_MENU: prefix + '/config/menu',
    CONFIG_SCHEMA: prefix + '/config/schema',
    SIGNIN: prefix + '/system/signin',
    SIGNUP: prefix + '/system/signup',
    LOGOUT: prefix + '/system/logout',
    FORGOT: prefix + '/system/forgot'
};