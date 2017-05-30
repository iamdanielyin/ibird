'use strict';

/**
 * 测试模块
 * Created by yinfxs on 2017/4/8.
 */


const moment = require('moment');
moment.locale('zh-cn');
const _ = require('lodash');
const log = require('..');
const logger = log.config({name: 'ibird-log', hostname: '127.0.0.1'});
// 或 const logger = log.logger;

const levels = ['trace', 'debug', 'warn', 'info', 'error', 'fatal'];

const fn = async () => {
    for (let i = 0; i < 100; i++) {
        const index = _.random(0, levels.length - 1);
        const level = levels[index];
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                logger[level]({time: moment().format('YYYY-MM-DD HH:mm:ss')}, `记录${level}日志：${level}......${i}`);
                resolve();
            }, 50);
        });
    }
};

fn();