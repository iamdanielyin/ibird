/**
 * winston日志
 * Created by yinfxs on 16-6-1.
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');
winston.emitErrs = true;

let logpath = 'logs';
/**
 * 文件转换器
 * @returns {exports.File}
 */
function errorTransports() {
    return new winston.transports.File({
        name: 'error-file',
        level: 'error',
        filename: path.resolve(logpath, 'error.log'),
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
function warnTransports() {
    return new winston.transports.File({
        name: 'warn-file',
        level: 'warn',
        filename: path.resolve(logpath, 'warn.log'),
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
function infoTransports() {
    return new winston.transports.File({
        name: 'info-file',
        level: 'info',
        filename: path.resolve(logpath, 'info.log'),
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
function verboseTransports() {
    return new winston.transports.Console({
        name: 'verbose-console',
        level: 'verbose',
        label: 'verbose-' + module.filename.split('/').slice(-2).join('/'),
        handleException: true,
        json: false,
        colorize: true
    });
}
/**
 * 控制台转换器
 * @returns {exports.Console}
 */
function debugTransports() {
    return new winston.transports.Console({
        name: 'debug-console',
        level: 'debug',
        label: 'debug-' + module.filename.split('/').slice(-2).join('/'),
        handleException: true,
        json: false,
        colorize: true
    });
}
/**
 * 控制台转换器
 * @returns {exports.Console}
 */
function sillyTransports() {
    return new winston.transports.Console({
        name: 'silly-console',
        level: 'silly',
        label: 'silly-' + module.filename.split('/').slice(-2).join('/'),
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
        transports: [errorTransports(), warnTransports(), infoTransports(), verboseTransports(), debugTransports(), sillyTransports()],
        exitOnError: false
    });
}

module.exports = logger;