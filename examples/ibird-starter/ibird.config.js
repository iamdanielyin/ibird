/**
 * 测试引用
 * Created by yinfxs on 16-5-30.
 */

'use strict';

const ibird = require('../../index.js');
const uuid = require('node-uuid');
const path = require('path');
const _ = require('underscore');
const moment = require('moment');
moment.locale('zh-cn');

//导入模块
const preset = require('./modules/preset');// 导入预置模块
const business = require('./modules/business');// 导入业务模块

//导入菜单
const menu = require('./menu');
module.exports = {
    "name": "${name}",
    "public": path.resolve(__dirname, './public'),
    "middlewares": function (app) {
        //挂载express中间件
    },
    "i18n": {
        selected: 'zh',
        sources: {
            'en': require('./i18n/en.i18n')
        }
    },
    "routes": {
        //全局路由配置
    },
    "menu": menu,
    "config": {
        "port": 3001,
        "route": "/admin",
        "client": path.resolve(__dirname, '/home/yinfx/WebstormProjects/ibird-client/build'),
        "ds": "mssql",//全局数据源设置：mongodb、mssql、mysql
        "mongodb": "mongodb://ibird:!QAZ2wsx@127.0.0.1:27017/ibird",//"mongodb://master:!QAZ2wsx@ds034279.mlab.com:34279/ibird-test",
        "mssql": {
            user: 'sa',
            password: 'wosoft!Admin',
            server: '121.41.46.25',
            database: 'ibird',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            }
        },
        "mysql": {
            connectionLimit: 10,
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'ibird'
        },
        "redis": "",
        "logpath": path.resolve(__dirname, "logs"),
        "ruprefix": '/api',
        "auth": {
            "expires_in": {
                "access_token": 7 * 24 * 60 * 60,//access_token过期时间，单位秒，0表示永久不过起
                "refresh_token": 0//refresh_token过期时间，单位秒，0表示永久不过起
            }
        },
        "cross-domain": true
    },
    "admins": [
        "yinfxs@gmail.com",
        "yinfxs@qq.com",
        "yinfxs"
    ],
    "modules": [
        preset(ibird),
        business(ibird)
    ],
    "hooks": {
        "pre-model": function (app, configs, data) {
            data.i = 1;
            // console.log("模型注册前", data.i);
        },
        "post-model": function (app, configs, data) {
            data.i++;
            // console.log("模型注册后", data.i);
        },
        "pre-module-route": function (app, configs, data) {
            data.i++;
            // console.log("模块路由注册前", data.i);
        },
        "post-module-route": function (app, configs, data) {
            data.i = data.i + 1;
            // console.log("模块路由注册后", data.i);
        },
        "pre-model-route": function (app, configs, data) {
            data.i = data.i + 1;
            // console.log("默认路由注册前", data.i);
        },
        "post-model-route": function (app, configs, data) {
            data.i = data.i + 1;
            // console.log("默认路由注册后", data.i);
        },
        "pre-start": function (app, configs, data) {
            data.i = data.i + 1;
            // console.log("启动应用前", data.i);
        },
        "post-start": function (app, configs, data) {
            data.i = data.i + 1;
            // console.log("应用启动后", data.i);
        }
    },
    "tasks": {
        // "*/2 * * * * *": [function (data, callback) {
        //     console.log('开始前延迟2秒');
        //     data.i = 221;
        //     setTimeout(function () {
        //         callback(data);
        //     }, 2000);
        // }, function (data) {
        //     console.log('2秒执行一次', data);
        // }, function (data) {
        //     data.i++;
        //     console.log('2秒任务初始化完成', data);
        // }],
        // "*/5 * * * * *": [function (data, callback) {
        //     console.log('开始前延迟5秒');
        //     data.i = 554;
        //     setTimeout(function () {
        //         callback(data);
        //     }, 5000);
        // }, function (data) {
        //     console.log('5秒执行一次', data);
        // }, function (data) {
        //     data.i++;
        //     console.log('5秒任务初始化完成', data);
        // }],
        // "*/1 * * * * *": [function (data, callback) {
        //     console.log('重复的1秒任务：开始前延迟1秒');
        //     data.i = 11111111111111111111;
        //     setTimeout(function () {
        //         callback(data);
        //     }, 1000);
        // }, function (data) {
        //     console.log('重复的1秒任务：1秒执行一次', data);
        // }, function (data) {
        //     data.i++;
        //     console.log('重复的1秒任务：1秒任务初始化完成', data);
        // }],
        // "custom": [
        //     {
        //         name: "def_task_1",
        //         spec: "*/1 * * * * *",
        //         pre: function (data, callback) {
        //             data.i = 110;
        //             console.log('1秒任务初始化开始：延迟1秒，每1秒执行一次', data);
        //             setTimeout(function () {
        //                 callback(data);
        //             }, 1000);
        //         },
        //         method: function (data) {
        //             console.log('1秒执行一次', data);
        //         },
        //         post: function (data) {
        //             console.log('1秒任务初始化完成！', data);
        //         }
        //     },
        //     {
        //         name: "def_task_3",
        //         spec: "*/3 * * * * *",
        //         pre: function (data, callback) {
        //             data.i = 330;
        //             console.log('3秒任务初始化开始：延迟3秒，每3秒执行一次', data);
        //             setTimeout(function () {
        //                 callback(data);
        //             }, 3000);
        //         },
        //         method: function (data) {
        //             data.j = 3000;
        //             console.log('3秒执行一次', data);
        //         },
        //         post: function (data) {
        //             console.log('3秒任务初始化完成！', data);
        //         }
        //     }
        // ]
    }
};
