'use strict';

/**
 * 工具模块
 * Created by yinfxs on 2017/4/6.
 */

const fs = require('fs');
const path = require('path');
const app = {};

module.exports = app;


/**
 * 安全转换字符串
 * @param string
 */
app.parse = (string) => {
    if (typeof string !== 'string') return {};
    if (typeof string === 'object') return string;
    try {
        return JSON.parse(string) || {};
    } catch (e) {
        return {};
    }
};


/**
 * 包装异常对象
 * @param e 异常对象
 * @param [_default] 默认值
 * @param [join] 多个异常信息之间的连接符
 */
app.errors = (e, _default, join = '，') => {
    if (!e) return null;
    if (typeof e.errors !== 'object') return _default || e.message;
    const errmsg = [];
    for (const key in e.errors) {
        const item = e.errors[key];
        if (!item || !item.message) return;
        errmsg.push(item.message);
    }
    if (errmsg.length == 0) errmsg.push(e.message);
    return errmsg.join(join);
};

/**
 * 按指定Key对数组内的对象排序
 * @param array 对象数组
 * @param key 指定key，值需为number类型
 */
app.sortBy = (array, key) => {
    if (!Array.isArray(array)) return array;
    if (typeof key !== 'string') return array;

    //是否逆序
    let reverse = false;
    if (key.startsWith('-')) {
        reverse = true;
        key = key.substring(1);
    }

    for (let i = 1; i < array.length; i++) {
        const value = array[i];
        let j = i - 1;
        let condtion = reverse ? (value[key] > array[j][key]) : (value[key] < array[j][key]);
        while (j >= 0 && condtion) {
            array[j + 1] = array[j];
            array[j] = value;
            j--;
        }
    }
    return array;
};

/**
 * 判断参数只为JavaScript对象
 * @param obj
 * @returns {boolean}
 */
app.isJustObject = (obj) => {
    return obj !== null && typeof obj === 'object' && Array.isArray(obj) === false ? true : false;
};

/**
 * 从对象中移除指定的key
 * @param obj
 * @param key，多个以英文空格分隔
 */
app.omit = (obj, key) => {
    if (typeof obj !== 'object' || Array.isArray(obj)) return obj;
    if (typeof key !== 'string' && !Array.isArray(key)) return obj;

    key = key.split(' ');

    const result = {};
    for (let k in obj) {
        if (key.indexOf(k) >= 0) continue;
        result[k] = obj[k];
    }
    return result;
};

/**
 * 从对象中获取指定的key
 * @param obj
 * @param key
 */
app.pick = (obj, key) => {
    if (!app.isJustObject(obj)) return obj;
    if (typeof key !== 'string' && !Array.isArray(key)) return obj;

    key = key.split(' ');

    const result = {};
    for (let k in obj) {
        if (key.indexOf(k) < 0) continue;
        result[k] = obj[k];
    }
    return result;
};

/**
 * 支持多层级不覆盖的Object.assign
 * @param dest
 * @param src
 */
app.assign = (dest, ...src) => {
    if (Array.isArray(src) && src.length >= 1) {
        if (src.length > 1) {
            for (const item of src) app.assign(dest, item);
        } else {
            src = src[0];
        }
    }
    if (!app.isJustObject(dest) || !app.isJustObject(src)) return dest;

    for (const key in src) {
        const value = src[key];
        if (!dest[key] || Array.isArray(value)) {
            dest[key] = value;
        } else if (app.isJustObject(value) && Object.keys(value).length > 0) {
            dest[key] = app.assign(dest[key], value);
        } else {
            dest[key] = value;
        }
    }
    return dest;
};

/**
 * 确保数组中的元素唯一
 * @param array
 */
app.uniq = (array) => {
    if (!Array.isArray(array)) return array;
    const result = [];
    for (const item of array) {
        if (result.indexOf(item) >= 0) continue;
        result.push(item);
    }
    return result;
};

/**
 * 根据keys的安全获取指定层级的value
 * @param object
 * @param keys
 */
app.value = (object, ...keys) => {
    if (!app.isJustObject(object) || !Array.isArray(keys) || keys.length === 0) return null;
    for (let key of keys) {
        if (object === null) return object;
        object = object[key] || null;
    }
    return object;
};

/**
 * 递归文件夹，并对所有js文件执行回调
 * @param dir
 * @param callback
 */
app.recursiveDir = (dir, callback) => {
    setTimeout(() => {
        try {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullpath = path.resolve(dir, file);
                const stat = fs.statSync(fullpath);
                if (stat.isFile() === false && stat.isDirectory() === false) continue;
                if (stat.isDirectory()) {
                    app.recursiveDir(fullpath, callback);
                    continue;
                }
                const parse = path.parse(fullpath);
                if (!parse || parse.ext !== '.js') continue;
                if (typeof callback === 'function') callback(require(fullpath));
            }
        } catch (e) {
            console.error(e);
        }
    });
};

/**
 * 将字符串格式转换成对象格式
 * @param str 字符串
 */
app.str2Obj = (str, flag) => {
    if (!str || !str.trim()) return {};
    const split = flag ? str.trim().split(flag)
        : (str.indexOf(' ') >= 0 ? str.trim().split(' ') : str.trim().split(','));
    const obj = {};
    if (split.length === 0) return {};
    for (let key of split) {
        if (!key) continue;
        key = key.trim();
        let value = 1;
        if (key.startsWith('-')) {
            key = key.substr(1);
            value = -1;
        }
        obj[key] = value;
    }
    return obj;
};