/**
 * 工具模块
 * Created by yinfxs on 16-6-1.
 */

'use strict';

const util = require('util');
const _ = require('underscore');

/**
 * 首字母大写
 * @param str
 * @returns {*}
 */
module.exports.firstUpper = function firstUpper(str) {
    str = str || '';
    if (!util.isString(str) || str.length == 0) return str;
    return str[0].toUpperCase() + str.substring(1);
};

/**
 * 首字母小写
 * @param str
 * @returns {*}
 */
module.exports.firstLower = function firstLower(str) {
    str = str || '';
    if (!util.isString(str) || str.length == 0) return str;
    return str[0].toLowerCase() + str.substring(1);
};