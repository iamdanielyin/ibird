/**
 * 测试引用
 * Created by yinfxs on 16-5-30.
 */

'use strict';

const ibird = require('../../index.js');
const config = require('./ibird.config');


ibird.initialize(config);
ibird.app.get('/', function (req, res) {
    res.end('Hello ibird!');
});
ibird.start();