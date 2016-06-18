/**
 * 测试引用
 * Created by yinfxs on 16-5-30.
 */

'use strict';

const server = require('./index.js');
const uuid = require('node-uuid');
const path = require('path');
const _ = require('underscore');
const moment = require('moment');
moment.locale('zh-cn');

//导入模块
const systemModule = require('./lib/modules/system');// 导入系统模块

server.initialize({
    "name": "ibird",
    "route": "/admin",
    "middlewares": function (app) {
        //挂载express中间件
    },
    "config": {
        "mongodb": "mongodb://master:!QAZ2wsx@ds034279.mlab.com:34279/ibird-test",
        "redis": "",
        "auth": {
            "expires_in": {
                "access_token": 7 * 24 * 60 * 60,//access_token过期时间，单位秒，0表示永久不过起
                "refresh_token": 0//refresh_token过期时间，单位秒，0表示永久不过起
            }
        }
    },
    "admins": [
        "13538828221@qq.com",
        "yinfxs@gmail.com"
    ],
    "modules": [
        systemModule(server),
        {
            "label": "业务模块",
            "code": "business",
            "icon": "suitcase",
            "schemas": {
                "dept": {
                    "label": "部门",
                    "obj": {
                        code: {
                            type: String,
                            label: "编码",
                            unique: true,
                            required: "编码({PATH})不能为空",
                            index: true,
                            default: function () {
                                return uuid.v1();
                            }
                        },
                        name: {
                            type: String,
                            label: "名称",
                            required: "名称({PATH})不能为空"
                        },
                        remark: {
                            type: String,
                            label: "备注"
                        },
                        ts: {
                            type: String,
                            label: "时间戳",
                            default: function () {
                                return moment().format('x');
                            }
                        },
                        dr: {
                            type: String,
                            label: "删除标记",
                            inputType: 'boolean-radios', items: {
                                '0': '否', '1': '是'
                            },
                            default: '0'
                        }
                    },
                    "options": {},
                    "customSchema": function (schema) {
                        return schema;
                    }
                },
                "param": {
                    "label": "业务参数",
                    "obj": {
                        code: {
                            type: String,
                            label: "参数编码",
                            unique: true,
                            required: "编码({PATH})不能为空",
                            index: true,
                            default: function () {
                                return uuid.v1();
                            }
                        },
                        name: {
                            type: String,
                            label: "参数名称",
                            required: "名称({PATH})不能为空"
                        },
                        value: {
                            type: String,
                            label: "参数值",
                            required: "参数值({PATH})不能为空"
                        },
                        remark: {
                            type: String,
                            label: "备注"
                        },
                        ts: {
                            type: String,
                            label: "时间戳",
                            default: function () {
                                return moment().format('x');
                            }
                        },
                        dr: {
                            type: String,
                            label: "删除标记",
                            inputType: 'boolean-radios', items: {
                                '0': '否', '1': '是'
                            },
                            default: '0'
                        }
                    },
                    "options": {},
                    "customSchema": function (schema) {
                        return schema;
                    }
                }
            }
        }
    ]
});

server.app.get('/', function (req, res) {
    res.end('Hello ibird!');
});

server.start();