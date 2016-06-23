/**
 * 系统模块
 * Created by yinfxs on 16-6-8.
 */

'use strict';

const uuid = require('node-uuid');
const _ = require('underscore');
const moment = require('moment');
moment.locale('zh-cn');

module.exports = function (server) {
    return {
        "label": "系统模块",
        "code": "system",
        "icon": "bars",
        "menu": [
            {
                "code": "usermgnt",
                "label": "用户管理",
                "icon": "users",
                "items": [
                    {
                        "code": "user",
                        "label": "系统用户",
                        "icon": "user",
                        "model": "user"
                    },
                    {
                        "code": "param",
                        "label": "系统参数",
                        "icon": "internet-explorer",
                        "model": "param"
                    }
                ]
            },
            {
                "code": "sysmgnt",
                "label": "系统管理",
                "icon": "cog",
                "items": [
                    {
                        "code": "commdl",
                        "label": "测试模型",
                        "icon": "list",
                        "model": "commdl"
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
                    email: {
                        type: String,
                        required: "邮箱({PATH})不能为空",
                        label: "邮箱"
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
                "auths": "GET,PUT,DELETE"
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
            "/signin": {
                "post": function (req, res) {
                    const User = server.model('system_user');
                    const admins = server.configs.admins;
                    const username = req.body.username || req.body.username;
                    const password = req.body.password || req.body.password;
                    if (admins.indexOf(username) == -1) return res.json({err: {message: "对不起，" + username + "为非管理帐号，请联系管理员对该帐号授权或使用已授权的管理帐号进行登录"}});
                    User.findOne({code: username}, function (err, data) {
                        if (err || !data) return res.json({err: {message: "用户 " + username + " 不存在"}});
                        if (!data.verifyPassword(password)) return res.json({err: {message: "密码不正确"}});
                        return res.json(server.auth.authorization({_id: data._id.toString()}));
                    });
                }
            },
            "/logout": {
                "post": function (req, res) {
                    const access_token = req.get('access_token');
                    server.auth.remove(access_token);
                    return res.json({message: '退出成功'});
                }
            },
            "/forgot": {
                "post": function (req, res) {
                    //发送邮件
                    return res.json({message: '发送成功'});
                }
            },
            "/profile": function (req, res) {
                const access_token = req.get('access_token');
                const User = server.model('system_user');
                server.auth.authentication(access_token, function (err, content) {
                    if (err || !content) return res.json({err: {message: "您的登录会话可能已过期，请重新登录"}});
                    User.findById(content._id, function (err, data) {
                        if (err || !data) return res.json({err: {message: "用户信息不存在，请稍后重试或联系其他管理员"}});
                        return res.json(data.toObject());
                    })
                });
            },
            "/authentication": function (req, res) {
                const access_token = req.get('access_token');
                server.auth.authentication(access_token, function (err, content) {
                    if (err || !content) return res.json({err: {message: "您的登录会话可能已过期，请重新登录"}});
                    return res.json({message: "欢迎访问系统主页"});
                });
            }
        }
    };
};