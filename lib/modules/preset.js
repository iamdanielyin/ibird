/**
 * 预置模块
 * Created by yinfxs on 16-6-8.
 */

'use strict';

const uuid = require('node-uuid');
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
moment.locale('zh-cn');

/**
 * mongodb登录
 * @param ibird
 * @param req
 * @param res
 * @param object
 */
function signinMongoDB(ibird, req, res, object) {
    const username = object.username;
    const password = object.password;
    const User = mongoose.model('preset-user');
    User.findOne({code: username}, function (err, data) {
        if (err || !data) return res.json({err: {message: "用户 " + username + " 不存在"}});
        if (!data.verifyPassword(password)) return res.json({err: {message: "密码不正确"}});
        return res.json(ibird.token.authorization({_id: data._id.toString()}));
    });
}
/**
 * SQLServer登录
 * @param ibird
 * @param req
 * @param res
 * @param object
 */
function signinMSSQL(ibird, req, res, object) {
    const username = object.username;
    const password = object.password;
    const mssql = ibird.mssql;
    mssql.query(`SELECT * FROM preset_user WHERE code = '${username}' and password = '${password}'`, function (data) {
        if (!data || data.length == 0) return res.json({err: {message: "用户不存在或用户名与密码不匹配"}});
        data = data[0];
        return res.json(ibird.token.authorization({_id: data._id.toString()}));
    }, function (err) {
        return res.json({err: err});
    });
}
/**
 * MySQL登录
 */
function signinMySQL() {

}

/**
 * MongoDB个人资料
 * @param ibird
 * @param req
 * @param res
 * @param _id
 */
function profileMongoDB(ibird, req, res, _id) {
    const User = mongoose.model('preset-user');
    User.findById(_id, function (err, data) {
        if (err || !data) return res.json({err: {message: "用户信息不存在，请稍后重试或联系其他管理员"}});
        return res.json(data.toObject());
    })
}
/**
 * SQLServer个人资料
 * @param ibird
 * @param req
 * @param res
 * @param _id
 */
function profileMSSQL(ibird, req, res, _id) {
    const mssql = ibird.mssql;
    mssql.query(`SELECT * FROM preset_user WHERE _id = '${_id}'`, function (data) {
        if (!data || data.length == 0) return res.json({err: {message: "用户信息不存在，请稍后重试或联系其他管理员"}});
        data = data[0];
        return res.json(data);
    }, function (err) {
        return res.json({err: err});
    });
}
/**
 * MySQL个人资料
 */
function profileMySQL() {

}
module.exports = function (ibird) {
    return {
        "label": "预置模块",
        "code": "preset",//模块编码不能重复且不能有下划线
        "config": {
            // "ds": "mongodb",//全局数据源设置：mongodb、mssql、
        },
        "schemas": [
            {
                "code": "user",
                "label": "系统用户",
                "fields": {
                    code: {
                        type: String,
                        label: "编码",
                        unique: true,
                        required: "编码({PATH})不能为空",
                        index: true
                    },
                    password: {
                        type: String,
                        ctrltype: 'password'
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
                        ctrltype: 'boolean-radios', items: {
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
            {
                "code": "param",
                "label": "系统参数",
                "query": {
                    show: false,
                    fast: 'code,name'
                },
                "fields": {
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
                        readonly: true,
                        default: function () {
                            return moment().format('x');
                        }
                    },
                    dr: {
                        type: String,
                        label: "删除标记",
                        ctrltype: 'boolean-radios', items: {
                            '0': '否', '1': '是'
                        },
                        default: '0'
                    }
                },
                "options": {},
                "customSchema": function (schema) {
                    return schema;
                },
                "view": {
                    "tableColumns": [
                        {label: '编码', name: 'code'},
                        {label: '名称', name: 'name'},
                        {label: '值', name: 'value'}
                    ],
                    "formCtrls": [
                        {label: '编码', name: 'code'},
                        {label: '名称', name: 'name'},
                        {label: '值', name: 'value'},
                        {label: '备注', name: 'remark'}
                    ]
                }
            },
            {
                "code": "token",
                "label": "令牌管理",
                "query": {
                    show: false,
                    fast: 'access_token,refresh_token'
                },
                "fields": {
                    access_token: {
                        type: String,
                        label: "访问token",
                        unique: true,
                        required: "访问token({PATH})不能为空",
                        index: true,
                        default: function () {
                            return uuid.v1();
                        }
                    },
                    refresh_token: {
                        type: String,
                        label: "更新token",
                        unique: true,
                        required: "更新token({PATH})不能为空",
                        index: true,
                        default: function () {
                            return uuid.v1();
                        }
                    },
                    expires_in_access: {
                        type: Number,
                        label: "访问token有效秒数",
                        required: "访问token有效秒数({PATH})不能为空"
                    },
                    expires_in_refresh: {
                        type: Number,
                        label: "刷新token有效秒数",
                        required: "刷新token有效秒数({PATH})不能为空"
                    },
                    data: {
                        type: String,
                        label: "额外数据"
                    },
                    ts: {
                        type: String,
                        label: "时间戳",
                        readonly: true,
                        default: function () {
                            return moment().format('x');
                        }
                    },
                    update_ts: {
                        type: String,
                        label: "更新时间",
                        readonly: true,
                        default: function () {
                            return moment().format('x');
                        }
                    },
                    dr: {
                        type: String,
                        label: "删除标记",
                        ctrltype: 'boolean-radios',
                        items: {
                            '0': '否', '1': '是'
                        },
                        default: '0'
                    }
                }
            },
            {
                "code": "commdl",
                "label": "测试模型",
                "_id": "",
                "query": {
                    fast: 'text'
                },
                "singleton": true,
                "delete": false,
                "update": true,
                "add": true,
                "fields": {
                    text: {
                        type: String,
                        label: "文本框",
                        required: "文本框({PATH})不能为空"
                    },
                    password: {
                        type: String,
                        required: true,
                        label: "密码框",
                        ctrltype: 'password',
                        display: false
                    },
                    date: {
                        type: String,
                        label: "日期",
                        ctrltype: 'date',
                        default: function () {
                            let date = moment().format('ll');
                            return date;
                        }
                    },
                    time: {
                        type: String,
                        label: "时间",
                        ctrltype: 'time',
                        default: function () {
                            let time = moment().format('HH:mm:ss.SSS');
                            return time;
                        }
                    },
                    datetime: {
                        type: String,
                        label: "日期时间",
                        ctrltype: 'datetime',
                        // format:'yyyy-mm-dd hh:ii:ss',//TODO 时间类型的格式化字符串yyyy-mm-dd hh:ii:ss
                        default: function () {
                            let datetime = moment().format('llll');
                            // let time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                            return datetime;
                        },
                        format: 'yyyy.mm.dd',
                        options: {}
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
                        ctrltype: 'boolean-radios',
                        // items: {
                        //     a: 'A-01', b: 'B-02'
                        // },
                        ajax: {
                            ref: 'preset-user',
                            url: '',
                            value: '_id',
                            display: 'code',
                            size: 2,
                            flag: 1//0分页，1全部
                        },
                        default: 'a'
                    },
                    booleanCheckbox: {
                        type: [String],
                        label: "多选",
                        ctrltype: 'boolean-checkbox',
                        // items: {
                        //     a: 'A-01', b: 'B-02', c: 'C-03'
                        // },
                        ajax: {
                            ref: 'preset-user',
                            url: '',
                            value: '_id',
                            display: 'code',
                            size: 3,
                            flag: 0//0分页，1全部
                        },
                        default: 'b,c',
                        display: {
                            table: false,
                            form: true
                        }
                    },
                    number: {
                        type: Number,
                        label: "数字",
                        ctrltype: 'number'
                    },
                    textarea: {
                        type: String,
                        label: "大文本",
                        ctrltype: 'textarea'
                    },
                    editor: {
                        type: String,
                        label: "编辑器",
                        ctrltype: 'editor'
                    },
                    ref: {
                        type: String,
                        label: "单引用",
                        ctrltype: 'ref',
                        ref: 'preset-user',
                        refOptions: {
                            value: '_id',
                            display: 'code'
                        }
                    },
                    refs: {
                        type: [String],
                        label: "多引用",
                        ctrltype: 'refs',
                        ref: 'preset-user',
                        refOptions: {
                            value: '_id',
                            display: 'code'
                        }
                    },
                    file: {
                        type: String,
                        label: "单文件/图片",
                        ctrltype: 'file'
                    },
                    files: {
                        type: String,
                        label: "多文件/图片",
                        ctrltype: 'files'
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
                },
                "hooks": {
                    "pre-create": function (data, callback) {
                        // console.log('pre-create');
                        // console.log(JSON.stringify(data));
                        callback(data);
                    },
                    "post-create": function (data) {
                        // console.log('post-create');
                        // console.log(JSON.stringify(data));
                    },
                    "pre-update": function (data, callback) {
                        // console.log('pre-update');
                        // console.log(JSON.stringify(data));
                        callback(data);
                    },
                    "post-update": function (data) {
                        // console.log('post-update');
                        // console.log(JSON.stringify(data));
                    },
                    "pre-delete": function (data, callback) {
                        // console.log('pre-delete');
                        // console.log(JSON.stringify(data));
                        callback(data);
                    },
                    "post-delete": function (data) {
                        // console.log('post-delete');
                        // console.log(JSON.stringify(data));
                    }
                }

            }
        ],
        "routes": {
            "/signin": {
                "post": {
                    "handler": function (req, res) {
                        const admins = ibird.configs.admins;
                        const username = req.body.username || req.body.username;
                        const password = req.body.password || req.body.password;
                        if (admins.indexOf(username) == -1) return res.json({err: {message: "对不起，" + username + "为非管理帐号，请联系管理员对该帐号授权或使用已授权的管理帐号进行登录"}});
                        const object = {username: username, password: password};

                        const configs = ibird.configs;
                        const ds = configs.config.ds ? configs.config.ds.toLowerCase() : 'mongodb';//默认MongoDB
                        //初始化数据源
                        switch (ds) {
                            case 'mongodb':
                                signinMongoDB(ibird, req, res, object);
                                break;
                            case 'mssql':
                                signinMSSQL(ibird, req, res, object);
                                break;
                            case 'mysql':
                                signinMySQL();
                                break;
                        }
                    },
                    "doc": {
                        'description': '登录',
                        'req': {
                            "*username": "用户名",
                            "*password": "密码"
                        },
                        'res': {
                            "*access_token": "84edff70-8014-11e6-9a22-ef95cc3c1a5b",
                            "*refresh_token": "84edff71-8014-11e6-9a22-ef95cc3c1a5b",
                            "*expires_in": {
                                "*access_token": 604800,
                                "*refresh_token": 0
                            },
                            "*_id": "57e2ae8db9a9f22d56f45cdf"
                        },
                        'example': `curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"\n -d 'username=yinfxs&password=yfx1020' "http://localhost:3000/preset/signin"\n————————————————————————————————————————————————————\n` + JSON.stringify({
                            "access_token": "84edff70-8014-11e6-9a22-ef95cc3c1a5b",
                            "refresh_token": "84edff71-8014-11e6-9a22-ef95cc3c1a5b",
                            "expires_in": {
                                "access_token": 604800,
                                "refresh_token": 0
                            },
                            "_id": "57e2ae8db9a9f22d56f45cdf"
                        }, null, 2)
                    }

                }
            },
            "/logout": {
                "post": function (req, res) {
                    const access_token = req.query.access_token || req.body.access_token;
                    ibird.token.remove(access_token);
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
                const access_token = req.query.access_token;
                ibird.token.authentication(access_token, function (err, content) {
                    if (err || !content) return res.json({err: {message: "您的登录会话可能已过期，请重新登录"}});

                    const configs = ibird.configs;
                    const ds = configs.config.ds ? configs.config.ds.toLowerCase() : 'mongodb';//默认MongoDB
                    //初始化数据源
                    switch (ds) {
                        case 'mongodb':
                            profileMongoDB(ibird, req, res, content._id);
                            break;
                        case 'mssql':
                            profileMSSQL(ibird, req, res, content._id);
                            break;
                        case 'mysql':
                            profileMySQL();
                            break;
                    }
                });
            },
            "/authentication": function (req, res) {
                const access_token = req.query.access_token;
                ibird.token.authentication(access_token, function (err, content) {
                    if (err || !content) return res.json({err: {message: "您的登录会话可能已过期，请重新登录"}});
                    return res.json({message: "欢迎访问系统主页"});
                });
            }
        }
    };
};