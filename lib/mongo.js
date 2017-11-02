'use strict';


/**
 * MongoDB配置信息
 * Created by yinfxs on 16-6-5.
 */

const moment = require('moment');
const mongoose = require('mongoose');
const i18n = require('./config').i18n;
const logger = require('./log')();
mongoose.Promise = global.Promise;

const cache = {};

module.exports = async (config) => {
    if (!config || cache.config == config) return;
    if (typeof config !== 'string' && !((typeof config === 'object') && !Array.isArray(config))) return;
    try {
        if (typeof config === 'string') {
            await mongoose.disconnect();
            await mongoose.connect(config);
        } else if (config.uri && config.opts) {
            await mongoose.disconnect();
            await mongoose.connect(config.uri, config.opts);
        } else {
            return logger.error(i18n.get('mongo_config_error', config));
        }
        cache.config = config;
        logger.info(i18n.get('mongo_start_success', moment().format('YYYY-MM-DD HH:mm:ss')));
    } catch (e) {
        logger.error(logger.error(i18n.get('mongo_start_error', e.message)));
    }
};