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

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" query=:query body=:body', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//开发环境下，监听客户端变换
if (!(process.env.NODE_ENV == 'production')) {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');

    app.use(webpackMiddleware(webpack(require(path.resolve(__dirname, '../webpack.config.js'))), {
        noInfo: false, // 只输出警告和异常信息到控制台
        quiet: false,//后台静默运行
        lazy: true,//懒加载模式，表示系统将不监听，但在每次请求时重新编译
        watchOptions: {//监听选项，仅当lazy:false时起效
            aggregateTimeout: 300,
            poll: true
        },
        stats: {
            colors: true
        }
    }));
}
module.exports = app;