/**
 * 测试引用
 * Created by yinfxs on 16-5-30.
 */

const server = require('./index.js');
const moment = require('moment');
const uuid = require('node-uuid');
moment.locale('zh-cn');

server.init({
    "name": "ibird",
    "route": "/admin",
    "publicFullPath": "/home/yinfx/WebstormProjects/ibird/public",
    "config": {
        "mongodb": "mongodb://master:!QAZ2wsx@ds034279.mlab.com:34279/ibird-test",
        "redis": ""
    },
    "admins": [
        "13538828221@qq.com",
        "yinfxs@gmail.com",
        "yinfxs"
    ],
    "modules": {
        "system": {
            "label": "系统模块",
            "icon": "bars",
            "menu": [
                {
                    "code": "users-class",
                    "label": "系统用户",
                    "icon": "users",
                    "items": [
                        {
                            "code": "user",
                            "label": "用户管理",
                            "icon": "user",
                            "model": "Usermdl"
                        },
                        {
                            "code": "onlinetool",
                            "label": "在线工具",
                            "icon": "internet-explorer",
                            "url": "http://jsonviewer.stack.hu/"
                        }
                    ]
                },
                {
                    "code": "sys-settings",
                    "label": "系统设置",
                    "icon": "cog",
                    "items": [
                        {
                            "code": "params",
                            "label": "参数管理",
                            "icon": "list",
                            "model": "Paramsmgnt"
                        }
                    ]
                }
            ],
            "schemas": {
                "Usermdl": {
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
                        password: {
                            type: String,
                            required: true
                        },
                        remark: {
                            type: String,
                            title: "备注({PATH})不能为空"
                        },
                        ts: {
                            type: String,
                            label: "时间戳",
                            default: function () {
                                let ts = moment().format('x');
                                return ts;
                            }
                        },
                        dr: {
                            type: Boolean,
                            label: "删除标记",
                            default: false
                        }
                    },
                    "options": {},
                    "customSchema": function (schema) {
                        return schema;
                    }
                },
                "Commdl": {
                    "obj": {
                        text: {
                            type: String,
                            label: "文本框",
                            required: "文本框({PATH})不能为空"
                        },
                        password: {
                            type: String,
                            required: true,
                            label: "密码框",
                            inputType: 'password'
                        },
                        date: {
                            type: String,
                            label: "日期",
                            inputType: 'date',
                            default: function () {
                                let date = moment().format('ll');
                                return date;
                            }
                        },
                        time: {
                            type: String,
                            label: "时间",
                            inputType: 'time',
                            default: function () {
                                let time = moment().format('HH:mm:ss.SSS');
                                return time;
                            }
                        },
                        datetime: {
                            type: String,
                            label: "日期时间",
                            inputType: 'datetime',
                            default: function () {
                                let datetime = moment().format('llll');
                                // let time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                                return datetime;
                            }
                        },
                        ts: {
                            type: String,
                            label: "时间戳",
                            default: function () {
                                let ts = moment().format('x');
                                return ts;
                            }
                        },
                        booleanRadios: {
                            type: String,
                            label: "单选",
                            inputType: 'boolean-radios', items: {
                                a: 'A-01', b: 'B-02'
                            },
                            default: 'a'
                        },
                        booleanCheckbox: {
                            type: String,
                            label: "多选",
                            inputType: 'boolean-checkbox', items: {
                                a: 'A-01', b: 'B-02', c: 'C-03'
                            },
                            default: 'b,c'
                        },
                        number: {
                            type: Number,
                            label: "数字",
                            inputType: 'number'
                        },
                        textarea: {
                            type: String,
                            label: "编辑器",
                            inputType: 'textarea'
                        },
                        ref: {
                            type: String,
                            label: "编辑器",
                            inputType: 'ref',
                            ref: 'Usermdl'
                        },
                        file: {
                            type: String,
                            label: "单文件/图片",
                            inputType: 'file'
                        }
                    },
                    "options": {},
                    "customSchema": function (schema) {
                        return schema;
                    }
                }
            },
            "routes": {
                '/haha1': function (req, res) {
                    return res.end('hello.../system/haha1...');
                },
                '/haha2': function (req, res) {
                    return res.end('hello.../system/haha2...');
                },
                '/hehe1': {
                    "post": function (req, res) {
                        return res.end('...post./system/hehe1...');
                    }
                }
            }
        },
        "custom": {
            "label": "自定义模块",
            "icon": "bars",
            "schemas": {
                "usermdl": {
                    "obj": {
                        code: {
                            type: String,
                            label: "编码",
                            unique: true,
                            required: "编码({PATH})不能为空",
                            index: true
                        },
                        name: {
                            type: String,
                            label: "名称",
                            required: "名称({PATH})不能为空"
                        },
                        password: {
                            type: String,
                            required: true
                        },
                        remark: {
                            type: String,
                            title: "备注({PATH})不能为空"
                        },
                        ts: {
                            type: String,
                            label: "时间戳"
                        },
                        dr: {
                            type: Boolean,
                            label: "删除标记",
                            default: false
                        }
                    },
                    "options": {},
                    "customSchema": function (schema) {
                        return schema;
                    }
                },
                "commdl": {
                    "obj": {
                        text: {
                            type: String,
                            label: "文本框",
                            required: "文本框({PATH})不能为空"
                        },
                        password: {
                            type: String,
                            required: true,
                            label: "密码框",
                            inputType: 'password'
                        },
                        date: {
                            type: String,
                            label: "日期",
                            inputType: 'date',
                            default: function () {
                                let date = moment().format('ll');
                                return date;
                            }
                        },
                        time: {
                            type: String,
                            label: "时间",
                            inputType: 'time',
                            default: function () {
                                let time = moment().format('HH:mm:ss.SSS');
                                return time;
                            }
                        },
                        datetime: {
                            type: String,
                            label: "日期时间",
                            inputType: 'datetime',
                            default: function () {
                                let datetime = moment().format('llll');
                                // let time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                                return datetime;
                            }
                        },
                        ts: {
                            type: String,
                            label: "时间戳",
                            default: function () {
                                let ts = moment().format('x');
                                return ts;
                            }
                        },
                        booleanRadios: {
                            type: String,
                            label: "单选",
                            inputType: 'boolean-radios', items: {
                                a: 'A-01', b: 'B-02'
                            },
                            default: 'a'
                        },
                        booleanCheckbox: {
                            type: String,
                            label: "多选",
                            inputType: 'boolean-checkbox', items: {
                                a: 'A-01', b: 'B-02', c: 'C-03'
                            },
                            default: 'b,c'
                        },
                        number: {
                            type: Number,
                            label: "数字",
                            inputType: 'number'
                        },
                        textarea: {
                            type: String,
                            label: "编辑器",
                            inputType: 'textarea'
                        },
                        ref: {
                            type: String,
                            label: "编辑器",
                            inputType: 'ref',
                            ref: 'Usermdl'
                        },
                        file: {
                            type: String,
                            label: "单文件/图片",
                            inputType: 'file'
                        }
                    },
                    "options": {},
                    "customSchema": function (schema) {
                        // instanceMethods
                        // modelMethods
                        // middleware
                        // schemeIndexes
                        // schemaOptions
                        // virtuals
                        // validations
                        return schema;
                    }
                }
            }
        }
    }
});


server.app.get('/', function (req, res) {
    res.end('Hello ibird-server!');
});

server.start();