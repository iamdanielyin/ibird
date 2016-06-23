/**
 * 路由地址定义
 * Created by yinfxs on 16-6-19.
 */

'use strict';

const prefix = location.protocol + '//' + location.host;

module.exports = {
    CONFIG_PUBLIC: prefix + '/config/public',
    CONFIG_PRIVATE: prefix + '/config/private',
    SIGNIN: prefix + '/system/signin',
    SIGNUP: prefix + '/system/user',
    LOGOUT: prefix + '/system/logout',
    FORGOT: prefix + '/system/forgot',
    PROFILE: prefix + '/system/profile',
    AUTHENTICATION: prefix + '/system/authentication',
    CUSTOM: (part) => (prefix + part)
};