'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const path = require('path');
const fs = require('fs-extra');
const bunyan = require('bunyan');
const app = {};
module.exports = app;

/**
 * 初始化配置
 * 初始化成功后，可以直接通过引用模块的logger属性访问日志对象
 * @param [obj] bunyan初始化配置对象，详见https://git.io/x4Pr
 * @returns {*} bunyan日志对象
 */
app.config = (obj) => {
    obj = (typeof obj === 'object') && !Array.isArray(obj) ? obj : {};
    obj = Object.assign({
        name: 'ibird',
        serializers: bunyan.stdSerializers,
        streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                type: 'rotating-file',
                level: 'error',
                path: path.join(process.cwd(), `logs/${obj.name || 'ibird' }-error.log`),
                period: '1d',
                count: 3
            },
            {
                type: 'rotating-file',
                level: 'info',
                path: path.join(process.cwd(), `logs/${obj.name || 'ibird' }.log`),
                period: '1d',
                count: 3
            }
        ]
    }, obj);
    // 自动创建日志文件
    if (obj.streams) {
        for (const item of obj.streams) {
            if (!item || !item.path) continue;
            fs.ensureFileSync(item.path);
        }
    }
    app.logger = bunyan.createLogger(obj);
    return app.logger;
};