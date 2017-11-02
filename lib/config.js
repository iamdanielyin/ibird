'use strict';

/**
 * 配置模块
 * Created by yinfxs on 2017/4/5.
 */

const path = require('path');
const logger = require('./log')();
const EventEmitter = require('events');
class TriggerEmitter extends EventEmitter {
}
const trigger = new TriggerEmitter();

const i18n = require('ibird-i18n');
const zh_cn = require('./i18n/i18n.zh-cn');
i18n.locale('zh-cn', zh_cn);
i18n.locale('zh-cn');

const app = {
    name: i18n.get('app_name'),
    port: 3000,
    mongo: 'mongodb://127.0.0.1:27017/ibird',
    bodyOpts: {},
    static: {},
    middleware: [],
    multipart: false,
    uploadPath: path.resolve(process.cwd(), 'public'),
    prefix: '/api',
    defaultApiPrefix: '',
    cross: false,
    model: {},
    schema: {},
    route: [],
    trigger: trigger,
    logger,
    i18n
};

module.exports = app;