/**
 * 路由地址定义
 * Created by yinfxs on 16-6-19.
 */

'use strict';

// const prefix = location.protocol + '//' + location.host;
const prefix = '/api';

module.exports = {
    CONFIGS: prefix + '/configs',
    SIGNIN: prefix + '/preset/signin',
    SIGNUP: prefix + '/preset/user',
    LOGOUT: prefix + '/preset/logout',
    FORGOT: prefix + '/preset/forgot',
    PROFILE: prefix + '/preset/profile',
    AUTHENTICATION: prefix + '/preset/authentication',
    CUSTOM: (part) => (prefix + part)
};