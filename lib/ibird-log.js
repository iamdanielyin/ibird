/**
 * winston日志
 * Created by yinfxs on 16-6-1.
 */
/**
 * 日志配置类
 */
'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');
winston.emitErrs = true;

function logger(module) {
    return new winston.Logger({
        transports: [
            new winston.transports.File({
                name: 'error-file',
                level: 'error',
                filename: path.resolve(__dirname, '../logs', 'error.log'),
                handleException: true,
                json: true,
                maxSize: 20971520, //20mb
                maxFiles: 5,
                colorize: false
            }),
            new winston.transports.Console({
                level: 'info',
                label: module.filename.split('/').slice(-2).join('/'),
                handleException: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
}

module.exports = logger;