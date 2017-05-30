'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const zh_cn = require('./i18n.zh-cn');
const app = {};
module.exports = app;

const current = Object.assign({}, zh_cn);
const object = {};

/**
 * 获取国际化值
 * @param key
 * @param [params] 参数值（任意类型），可选
 * @returns {*}
 */
app.get = (key, ...params) => {
    return (typeof current[key] === 'function') ? current[key](params) : current[key];
};

/**
 * 获取、切换、注册国际化配置
 * 1. 当code、config皆为空时，返回当前使用的国际化配置对象
 * 2. 当code不为空，config为空时，切换code指定的国际化配置对象
 * 3. 当code、config皆不为空时，注册新的国际化配置对象
 * @param code 国际化代码，一般为国家代码
 * @param config 国际化配置对象，包含所有项的配置对象
 * @returns {{}}
 */
app.locale = (code, config) => {
    if (!code && !config) return current;// 获取当前应用的国际化配置
    if ((typeof code === 'string') && !config) {
        // 切换指定的国际化配置
        object[code] = (typeof object[code] === 'object') ? object[code] : {};
        Object.assign(current, object[code]);
        return current;
    }
    // 注册新的国际化配置
    if ((typeof code === 'string') && (typeof config === 'object')) {
        object[code] = config;
    }
    // 批量注册
    if ((typeof code === 'object') && !config) {
        for (const key in code) {
            const item = config[key];
            if ((typeof key !== 'string') || (typeof item !== 'object') || Array.isArray(item)) continue;
            app.locale(key, item);
        }
    }
    return current;
};