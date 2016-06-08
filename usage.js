/**
 * 测试引用
 * Created by yinfxs on 16-5-30.
 */

const server = require('./index.js');
const moment = require('moment');
const path = require('path');
const uuid = require('node-uuid');
const _ = require('underscore');
moment.locale('zh-cn');

server.initialize({
    "name": "ibird",
    "route": "/admin",
    "publicRoot": '/home/yinfx/WebstormProjects/ibird-server/public',
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
        "yinfxs@gmail.com",
        "yinfxs"
    ],
    "modules": [
        {
            "label": "系统模块",
            "code": "system",
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
                "user": {
                    "label": "系统用户",
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
                        password: {
                            type: String,
                            required: "密码({PATH})不能为空",
                            label: "密码框",
                            inputType: 'password'
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
                    "options": {
                        "toObject": {
                            "transform": (doc, ret, options) =>_.omit(ret, 'hashedPassword', 'passwordSalt')
                        }
                    },
                    "auths": "GET,PUT"
                },
                "param": {
                    "label": "系统参数",
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
                },
                "commdl": {
                    "label": "测试模型",
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
            },
            "routes": {
                "/login": {
                    "post": function (req, res) {
                        const User = server.model('system_user');
                        const username = req.body.username || req.body.username;
                        const password = req.body.password || req.body.password;
                        User.findOne({code: username}, function (err, data) {
                            if (err || !data) return res.json({err: {message: "用户 " + username + " 不存在"}});
                            if (!data.verifyPassword(password)) return res.json({err: {message: "密码不正确"}});
                            return res.json(server.auth.authorization());
                        });
                    }
                },
                "/logout": {
                    "post": function (req, res) {
                        const User = server.model('system_user');
                        const access_token = req.get('access_token');
                        server.auth.remove(access_token);
                        return res.json({message: '退出成功'});
                    }
                }
            }
        },
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
    res.end('Hello ibird-server!');
});

server.start();