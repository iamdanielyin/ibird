/**
 * 数据范围中间件
 * Created by yinfxs on 16-12-19.
 */
'use strict';

const _ = require('lodash');

module.exports = (req, res, next) => {
    const token = req.access_token;
    if (!token) return next();
    const org = token.data.org || {};
    const _id = token.data._id;
    const orgs = token.orgs;
    let authscope = {};
    if ('ibird' != _id) {
        switch (parseInt(token.scope)) {
            case 1:
                //个人
                authscope = {$or: [{org: {$in: orgs}}, {creater: _id}, {modifier: _id}]};
                break;
            case 2:
                //2本级
                authscope = {$or: [{org: {$in: orgs}}, {creater: _id}, {modifier: _id}]};
                break;
            case 3:
                // 3本级及以下
                authscope = {$or: [{org: {$in: orgs}}, {creater: _id}, {modifier: _id}]};
                break;
            default:
                authscope = {$or: [{org: {$in: orgs}}, {creater: _id}, {modifier: _id}]};
                break;
        }
    }
    req.authscope = authscope;
    next();
};