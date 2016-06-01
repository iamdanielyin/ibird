/**
 * Express相关配置
 * Created by yinfxs on 16-5-30.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const FileStreamRotator = require('file-stream-rotator');
const morgan = require('morgan');

const app = express();

var logDirectory = path.resolve(__dirname, '../', 'logs');
// 确保日志目录存在
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// 创建一个访问日志写入流
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

// 自定义morgan.tokens
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body);
});
morgan.token('query', function (req, res) {
    return JSON.stringify(req.query);
});

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :query :body', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

module.exports = app;