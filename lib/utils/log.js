/**
 * winston日志
 * Created by yinfxs on 16-6-1.
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');
const moment = require('moment');
winston.emitErrs = true;

let logpath = 'logs';
/**
 * 文件转换器
 * @returns {exports.File}
 */
function errorTransports(module) {
    return new winston.transports.File({
        name: 'error-file',
        level: 'error',
        filename: path.resolve(logpath, 'error.log'),
        label: '输出模块:' + module.filename,
        timestamp: function () {
            return moment().format('llll');
        },
        handleException: true,
        json: true,
        maxSize: 20971520, //20mb
        maxFiles: 5,
        colorize: false
    });
}
/**
 * 文件转换器
 * @returns {exports.File}
 */
function warnTransports(module) {
    return new winston.transports.File({
        name: 'warn-file',
        level: 'warn',
        filename: path.resolve(logpath, 'warn.log'),
        label: '输出模块:' + module.filename,
        timestamp: function () {
            return moment().format('llll');
        },
        handleException: true,
        json: true,
        maxSize: 20971520, //20mb
        maxFiles: 5,
        colorize: false
    });
}
/**
 * 文件转换器
 * @returns {exports.File}
 */
function infoTransports(module) {
    return new winston.transports.File({
        name: 'info-file',
        level: 'info',
        filename: path.resolve(logpath, 'info.log'),
        label: '输出模块:' + module.filename,
        timestamp: function () {
            return moment().format('llll');
        },
        handleException: true,
        json: true,
        maxSize: 20971520, //20mb
        maxFiles: 5,
        colorize: false
    });
}
/**
 * 控制台转换器
 * @returns {exports.Console}
 */
function debugTransports(module) {
    return new winston.transports.Console({
        name: 'debug-console',
        level: 'debug',
        label: 'ibird-logs:' + module.filename.split('/').slice(-2).join('/'),
        timestamp: function () {
            return moment().format('llll');
        },
        handleException: true,
        json: false,
        colorize: true
    });
}
/**
 * 日期对象
 * @param module
 * @param path
 * @returns {*}
 */
function logger(module, path) {
    if (path) {
        logpath = path || logpath;
        fs.ensureDirSync(logpath);
    }
    return new winston.Logger({
        transports: [errorTransports(module), warnTransports(module), infoTransports(module), debugTransports(module)],
        exitOnError: false
    });
}

module.exports = logger;