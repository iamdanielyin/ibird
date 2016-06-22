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
module.exports.firstUpper = function (str) {
    str = str || '';
    if (!util.isString(str) || str.length == 0) return str;
    return str[0].toUpperCase() + str.substring(1);
};

/**
 * 首字母小写
 * @param str
 * @returns {*}
 */
module.exports.firstLower = function (str) {
    str = str || '';
    if (!util.isString(str) || str.length == 0) return str;
    return str[0].toLowerCase() + str.substring(1);
};

/**
 * 扩展underscore.pick，支持子级操作
 * @param object
 * @param keys 格式字符串数组
 * @returns {*}
 */
module.exports.pick = function pick(object, keys) {
    if (!keys || keys.length == 0) return object;
    let result = {};
    keys.map(function (key) {
        if (key.indexOf('.') == -1) result = joinObject(result, _.pick(object, key));
        result = joinObject(result, objectKey({}, key, object));
    });
    return result;
};

/**
 * 将src中所有的属性复制到dest中，如果相同则覆盖，支持无穷嵌套
 * @param dest
 * @param src
 */
function joinObject(dest, src) {
    _.keys(src).map(function (key) {
        if (!_.has(dest, key) || (typeof dest[key] !== typeof src[key]) || !(_.isObject(dest[key]))) dest[key] = src[key];
        const object = src[key];
        dest[key] = joinObject(dest[key], src[key]);
    });
    return dest;
}
/**
 * 根据格式字符串获取对象值
 * @param object 对象
 * @param key 模式字符串，如"obj.code.name"对应{obj:{code:{name:"值"}}}
 * @param souce
 * @returns {*}
 */
function objectKey(object, key, souce) {
    const keysArray = _.isArray(key) ? key : key.split('.');
    const currentKey = keysArray[0];
    if (keysArray.length == 1) {
        // if(!_.has(souce,key)) return object;
        object[key] = _.pick(souce, key)[key];
        return object;
    }
    keysArray.splice(0, 1);
    object[currentKey] = objectKey({}, keysArray.join('.'), _.pick(souce, currentKey)[currentKey]);
    return object;
}