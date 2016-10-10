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
function fileTransports() {
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
 * 控制台转换器
 * @returns {exports.Console}
 */
function consoleTransports() {
    return new winston.transports.Console({
        level: 'info',
        label: module.filename.split('/').slice(-2).join('/'),
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
        transports: [fileTransports(), consoleTransports()],
        exitOnError: false
    });
}

module.exports = logger;