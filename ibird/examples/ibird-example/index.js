/**
 * 测试模块
 * Created by yinfxs on 16-5-30.
 */

'use strict';

const ibird = require('../../index');
const config = require('./ibird.config');

ibird.initialize(config).start();