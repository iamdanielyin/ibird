/**
 * 工具模块
 * Created by yinfxs on 16-6-1.
 */

'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const moment = require('moment');
const app = {};

exports = module.exports = app;

/**
 * 首字母大写
 * @param str
 * @returns {*}
 */
app.firstUpper = function (str) {
    str = str || '';
    if (!util.isString(str) || str.length == 0) return str;
    return str[0].toUpperCase() + str.substring(1);
};

/**
 * 首字母小写
 * @param str
 * @returns {*}
 */
app.firstLower = function (str) {
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
app.pick = function pick(object, keys) {
    if (!keys || keys.length == 0) return object;
    if (_.isArray(keys) != true) keys = [keys];
    let result = {};
    keys.forEach(function (key) {
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
    _.keys(src).forEach(function (key) {
        if (!_.has(dest, key) || (typeof dest[key] !== typeof src[key]) || !(_.isObject(dest[key]))) dest[key] = src[key];
        const object = src[key];
        dest[key] = joinObject(dest[key], src[key]);
    });
    return dest;
}
app.joinObject = joinObject;
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
app.objectKey = objectKey;

/**
 * 格式化字符串
 * @param string
 * @param params
 * @param flag 占位符，默认为英文问号?
 */
app.format = function (string, params, flag) {
    flag = flag || '?';
    if (!string) return string;
    const splits = string.split(flag);
    if (!params || (splits.length - 1) != params.length) return string;
    const result = [];
    splits.forEach(function (s, i) {
        if (!s) return;
        result.push(params[i] ? s + params[i] : s);
    });
    return result.join('');
};

/**
 * 深复制
 * @param obj
 * @returns {*}
 */
app.deepClone = function (obj) {
    let cloneObj;
    if (!_.isObject(obj) || typeof obj === 'function') {
        return obj;
    }
    cloneObj = _.isArray(obj) ? [] : {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (!_.isObject(obj[i])) {
                // obj[i]为null和undefined都会进入这里
                cloneObj[i] = obj[i];
            } else {
                cloneObj[i] = app.deepClone(obj[i]);
            }
        }
    }
    return cloneObj;
};

/**
 * 快速获取当前日期
 * @param format Moment.js格式字符串，详见http://momentjs.cn/docs/#/parsing/
 * @returns {*|ServerResponse}
 */
app.date = function (format) {
    format = format || 'YYYY-MM-DD';
    return moment().format(format);
};
/**
 * 快速获取当前时间
 * @param format Moment.js格式字符串，详见http://momentjs.cn/docs/#/parsing/
 * @returns {*|ServerResponse}
 */
app.time = function (format) {
    // format = format || 'YYYY-MM-DD HH:mm:ss.SSS';
    format = format || 'YYYY-MM-DD HH:mm:ss';
    return moment().format(format);
};

/**
 * 复制文件或者目录
 * @param src
 * @param dst
 * @param stream
 * @param filters 过滤数组，过滤相对路径
 * @param relative
 */
app.copy = function (src, dst, stream, filters, relative) {
    const srcPath = relative ? path.resolve(src, relative) : src;
    const dstPath = relative ? path.resolve(dst, relative) : dst;
    filters = filters || [];
    try {
        const stats = fs.lstatSync(srcPath);
        if (!stats) return false;
        if (filters.indexOf(relative) != -1) return true;
        if (stats.isFile() == true) {
            if (stream) return fs.createReadStream(srcPath).pipe(fs.createWriteStream(dstPath));
            fs.writeFileSync(dstPath, fs.readFileSync(srcPath));
        } else if (stats.isDirectory()) {
            if (dstPath != dst) fs.mkdirSync(dstPath);
            const items = fs.readdirSync(srcPath);
            items.forEach(function (item) {
                app.copy(src, dst, true, filters, relative ? path.join(relative, item) : item);
            });
        }
    } catch (e) {
        return false;
    }
};

/**
 * 执行hooks函数
 * @param hooks 配置中的hooks对象
 * @param status 当前状态
 * @param app 应用express对象
 * @param configs 应用配置对象
 * @param data 数据流通对象
 */
app.execHooks = function execHooks(hooks, status, app, configs, data) {
    if (!hooks || !status) return;
    const func = hooks[status];
    if (!_.isFunction(func)) return;
    func(app, configs, data);
};