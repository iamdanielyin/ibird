/**
 * 国际化工具模块
 * Created by yinfxs on 16-8-7.
 */

'use strict';

const assign = require('object-assign');
const _ = require('lodash');
const utility = require('./utility');
var i18n = {};
var object = {};


module.exports = function (config) {
    let defaults = {
        selected: 'zh',
        sources: {
            'zh': require('../i18n/zh.i18n'),
            'en': require('../i18n/en.i18n')
        }
    };
    if (!config) {
        config = defaults;
    } else {
        //合并config和defaults
        const sourcesKeys = _.union(Object.keys(config.sources), Object.keys(defaults.sources));
        sourcesKeys.forEach(function (key) {
            if (!defaults.sources[key]) return;
            //如果存在用户自定义的国际化配置，则用新的替换旧的来实现对系统的覆盖
            config.sources[key] = assign(defaults.sources[key], config.sources[key]);
        });
        config.selected = config.selected || defaults.selected;
    }
    i18n = config;
    object = config.sources[config.selected];
    return config;
};
/**
 * 根据key获取多语配置值
 * @param key
 * @param params
 * @param flag
 * @returns {string}
 */
module.exports.value = function (key, params, flag) {
    key = !key ? '' : key.trim();
    if (!key || !key.trim()) return '';
    if (key.startsWith('${') == false || key.endsWith('}') == false) return utility.format(object[key], params, flag);
    key = key.substring(2, key.length - 1);
    return utility.format(object[key], params, flag);
};

/**
 * 重新设置当前语言
 * @param lang 语言编码
 * @returns {*}
 */
module.exports.set = function (lang) {
    if (!lang || Object.keys(i18n.sources).indexOf(lang) == -1) return false;
    i18n.selected = lang;//设置当前选中语言
    object = i18n.sources[i18n.selected];
    return object;
};

/**
 * 将传入json的值按国际化配置处理后返回
 * @param json 需要处理的json
 * @returns {*}
 */
module.exports.format = function (json) {
    if (!json) return json;
    Object.keys(json).forEach(function (key) {
        if (_.isArray(json[key]) == true) {
            //数组
            json[key].forEach(function (item, i) {
                json[key][i] = module.exports.format(item);
            });
        } else if (_.isObject(json[key]) == true) {
            //对象
            json[key] = module.exports.format(json[key]);
        } else if (_.isString(json[key]) == true) {
            //字符串
            if (json[key].startsWith('${') == false || json[key].endsWith('}') == false) return;
            json[key] = module.exports.value(json[key]) || json[key];
        }
    });
    return json;
};

/**
 * 获取当前语言
 * @returns {*}
 */
module.exports.selected = function () {
    return i18n.selected;
};

/**
 * 获取当前语言的配置
 * @returns {{}}
 */
module.exports.object = function () {
    return object;
};