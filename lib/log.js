'use strict';

/**
 * 默认日志处理模块
 * Created by yinfxs on 2017/4/8.
 */

const config = require('./config');
const app = {};

module.exports = () => {
    for (const level of ['trace', 'debug', 'warn', 'info', 'error', 'fatal']) {
        app[level] = (...args) => {
            if (args.length == 0) return;
            if (config.logger && (typeof config.logger[level] === 'function')) {
                return config.logger[level](args);
            }
            switch (level) {
                case 'debug':
                    console.info(args.join(' '));
                    break;
                case 'trace':
                    console.trace(args.join(' '));
                    break;
                case 'fatal':
                    console.error(args.join(' '));
                    break;
                default:
                    console[level](args.join(' '));
                    break;
            }
        };
    }
    return app;
};