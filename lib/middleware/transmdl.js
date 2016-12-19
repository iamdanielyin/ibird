/**
 * 将查询参数中的access_token转换成服务端对象
 * Created by yinfxs on 16-12-19.
 */
'use strict';

const _ = require('lodash');
const tokenAdapter = require('../token/adapter');

module.exports = (req, res, next) => {
    tokenAdapter.authentication(req.query.access_token, (err, result) => {
        if (err) return next();
        req.access_token = result;
        next();
    });
};