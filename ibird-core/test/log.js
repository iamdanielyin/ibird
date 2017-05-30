'use strict';

/**
 * 日志测试
 * Created by yinfxs on 2017/4/8.
 */


const logger = require('../lib/log')();

logger.info('ibird.logger.info');
logger.error('ibird.logger.error');
logger.warn('ibird.logger.warn');
logger.debug('ibird.logger.debug');
logger.fatal('ibird.logger.fatal');
logger.trace('ibird.logger.trace');