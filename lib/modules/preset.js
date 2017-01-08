/**
 * 预置模块
 * Created by yinfxs on 16-6-8.
 */

'use strict';

const uuid = require('uuid');
const assign = require('object-assign');
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    const UserModel = ibird.models['preset-user'];
    const RoleModel = ibird.models['preset-role'];
    const OrgModel = ibird.models['preset-org'];
    const User = UserModel.value;
    const Role = RoleModel.value;
    const Org = OrgModel.value;
    User.findOne({code: username}).populate('org').exec((err, data) => {
        if (err || !data) return res.json({err: {message: "用户 " + username + " 不存在"}});
        if (!data.verifyPassword(password)) return res.json({err: {message: "密码不正确"}});
        data = _.omit(data._doc, getOmitFields(UserModel.schema));
        Role.find({_id: {$in: data.roles || []}}, (err, roles) => {
            if (err) return res.json({err: {message: "查询用户角色 " + username + " 异常"}});
            const transforms = transformRoles(roles);
            data.roles = transforms.all;
            //查询可见公司的列表
            const authResult = (orgs) => {
                const result = ibird.token.authorization({
                    _id: data._id.toString(),
                    data: data,
                    scope: transforms.scope,
                    orgs: orgs,
                    rolesData: roles
                });
                result.data.roles = transforms.view;
                assign(result, {configs: {private: ibird._configs('PRIVATE')}});
                return res.json(result);
            };
            switch (parseInt(transforms.scope)) {
                case 1:
                    //个人
                    authResult(['', null, undefined]);
                    break;
                case 2:
                    //本级
                    authResult([data.org._id, '', null, undefined]);
                    break;
                case 3:
                    //本级及以下
                    const pids = data.org.pids ? data.org.pids + ',' + data.org._id : data.org._id;
                    Org.find({pids: new RegExp(pids)}, '_id name pid pids', (err, result) => {
                        if (err) return res.json({err: {message: "查询机构数据异常，请稍后再试"}});
                        let orgs = [];
                        result.forEach(item => orgs.push(item._id));
                        orgs.push(data.org._id);
                        orgs = _.uniq(orgs);
                        orgs.push('', null, undefined);
                        authResult(orgs);
                    });
                    break;
                default:
                    authResult(['']);
                    break;
            }
        });
    });
}

/**
 * 过滤服务端权限
 * @param roles
 * @returns {*}
 */
function transformRoles(roles) {
    let all = [], view = [], scope = 1;//1.个人 < 2.本级 < 3.本级及以下
    roles.forEach((item) => {
        if (parseInt(item.scope) > scope) scope = parseInt(item.scope);
        all = all.concat(item.resources);
    });
    all = _.uniq(all);
    //过滤服务端权限
    all.forEach(key => {
        if (key.endsWith('service')) return;
        view.push(key);
    });
    return {scope: scope, all: all, view: view};
}

/**
 * 获取所有密码类型的字段key
 * @param schema
 * @returns {*}
 */
function getOmitFields(schema) {
    const result = [];
    if (!schema || !schema.fields) return;
    const fields = schema.fields;
    _.keys(fields).forEach((key) => {
        if (!key || !fields[key]) return;
        const field = fields[key];
        if (!field || 'password' != field.ctrltype) return;
        result.push(key);
    });
    return result;
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
                "label": "用户档案",
                "archive": true,
                "query": {
                    "fast": "code,name"
                },
                "fields": {
                    _id: {
                        type: String,
                        unique: true,
                        required: "用户标识({PATH})不能为空",
                        index: true,
                        default: () => uuid.v1()
                    },
                    code: {
                        label: "帐号",
                        required: "帐号({PATH})不能为空"
                    },
                    password: {
                        type: String,
                        label: "密码",
                        ctrltype: 'password'
                    },
                    email: {
                        type: String,
                        label: "邮箱"
                    },
                    roles: {
                        type: [String],
                        label: "分配角色",
                        ctrltype: 'boolean-checkbox',
                        display: {
                            table: false
                        },
                        ajax: {
                            ref: 'preset-role',
                            url: '',
                            value: '_id',
                            display: 'name',
                            template: '${code} | ${name}',
                            size: 20,
                            flag: 0//0分页，1全部
                        }
                    },
                },
                "options": {
                    "toObject": {
                        "transform": (doc, ret, options) => _.omit(ret, 'hashedPassword', 'passwordSalt')
                    }
                },
                "tokens": "GET,PUT,DELETE"
            },
            {
                "code": "org",
                "label": "机构档案",
                "archive": true,
                "query": {
                    "fast": "code,name"
                },
                "fields": {
                    _id: {
                        type: String,
                        label: "机构标识",
                        unique: true,
                        index: true,
                        display: {
                            table: false,
                            form: false
                        },
                        default: () => uuid.v1()
                    },
                    code: {
                        label: "机构编码"
                    },
                    name: {
                        label: "机构名称"
                    },
                    pid: {
                        type: String,
                        label: "上级机构",
                        ctrltype: 'ref',
                        ref: 'preset-org',
                        refOptions: {
                            value: '_id',
                            display: 'name',
                            code: 'code',
                            template: '${code} | ${name}',
                        }
                    },
                    pids: String
                },
                "options": {
                    "toObject": {
                        "transform": (doc, ret, options) => _.omit(ret, 'hashedPassword', 'passwordSalt')
                    }
                },
                "tokens": "GET,PUT,DELETE",
                "hooks": {
                    "pre-create": function (data, callback) {
                        data = _.isArray(data) ? data : [data];
                        const pids = [];
                        data.forEach((item) => {
                            if (!item || !item.pid) return;
                            pids.push(item.pid);
                        });
                        const Org = ibird.models['preset-org'].value;
                        Org.find({_id: {$in: pids}}, (err, result) => {
                            if (err) return callback(data);
                            const resultMap = {};
                            result.forEach((item) => resultMap[item._id] = item);
                            data.forEach((item) => {
                                if (!item || !item.pid) return;
                                const org = resultMap[item.pid];
                                item.pids = org.pids ? (org.pids + ',' + item.pid) : item.pid;
                            });
                            callback(data);
                        });
                    },
                    "pre-update": function (body, callback) {
                        const data = body.doc;
                        const pids = [data.pid];
                        const Org = ibird.models['preset-org'].value;
                        Org.find({_id: {$in: pids}}, (err, result) => {
                            if (err) return callback({cond: body.cond, doc: data});
                            const resultMap = {};
                            result.forEach((item) => resultMap[item._id] = item);
                            const org = resultMap[data.pid];
                            data.pids = org.pids ? (org.pids + ',' + data.pid) : data.pid;
                            callback({cond: body.cond, doc: data});
                        });
                    }
                }
            },
            {
                "code": "resource",
                "label": "资源管理",
                "archive": true,
                "query": {
                    "fast": "code,name"
                },
                "fields": {
                    _id: {
                        type: String,
                        unique: true,
                        required: "资源标识({PATH})不能为空",
                        index: true,
                        default: () => uuid.v1()
                    },
                    code: {
                        label: "资源编码"
                    },
                    name: {
                        label: "资源名称"
                    },
                    type: {
                        type: String,
                        label: "资源类型",
                        ctrltype: 'boolean-radios', items: {
                            '1': '系统维护', '2': '主动维护'
                        },
                        default: '2',
                        required: "资源类型({PATH})不能为空"
                    },
                    tag: {
                        type: String,
                        label: "分组标识"
                    },
                },
                "hooks": {
                    "pre-create": function (data, callback) {
                        data = _.isArray(data) ? data : [data];
                        const result = [];
                        data.forEach(item => {
                            if (!item || !item.code) return;
                            item._id = item.code;//手动设置code为_id
                            result.push(item);
                        });
                        callback(result);
                    },
                    "pre-list": function (req, conditions, callback) {
                        const token = req.access_token || {};
                        const roles = token.data.roles;
                        const _id = token.data._id;
                        if (!roles || !_.isArray(roles) || roles.length == 0) return callback();
                        const $and = conditions['$and'] || [];
                        if ('ibird' != _id) {
                            $and.push({_id: {$in: roles}});
                            conditions['$and'] = $and;
                        }
                        callback(conditions);
                    }
                }
            },
            {
                "code": "role",
                "label": "角色管理",
                "query": {
                    "fast": "code,name"
                },
                "archive": true,
                "auths": false,
                "fields": {
                    _id: {
                        type: String,
                        unique: true,
                        required: "角色标识({PATH})不能为空",
                        index: true
                    },
                    code: {
                        label: "角色编码"
                    },
                    name: {
                        label: "角色名称"
                    },
                    scope: {
                        type: String,
                        label: "数据范围",
                        ctrltype: 'boolean-radios', items: {
                            '1': '个人', '2': '本级', '3': '本级及以下'
                        },
                        default: '1'
                    },
                    resources: {
                        type: [String],
                        label: "关联资源",
                        ctrltype: 'boolean-checkbox',
                        ajax: {
                            ref: 'preset-resource',
                            value: '_id',
                            display: 'name',
                            template: '${code} | ${name}',
                            group: 'tag',
                            size: 30,
                            flag: 1
                        },
                        display: {
                            table: false,
                            form: true
                        }
                    }
                },
                "hooks": {
                    "pre-create": function (data, callback) {
                        data = _.isArray(data) ? data : [data];
                        const result = [];
                        data.forEach(item => {
                            if (!item || !item.code) return;
                            item._id = item.code;//手动设置code为_id
                            result.push(item);
                        });
                        callback(result);
                    },
                }
            },
            {
                "code": "param",
                "label": "系统参数",
                "archive": true,
                "query": {
                    "fast": "code,name"
                },
                "fields": {
                    code: {
                        label: "参数编码"
                    },
                    name: {
                        label: "参数名称"
                    },
                    value: {
                        display: {
                            table: false,
                            form: false
                        },
                        type: Schema.Types.Mixed,
                        label: "参数值",
                        required: "参数值({PATH})不能为空"
                    }
                },
                "options": {}
            },
            {
                "code": "commdl",
                "label": "测试模型",
                "_id": "",
                "query": {
                    fast: 'text'
                },
                "singleton": false,
                "delete": false,
                "update": true,
                "add": true,
                "cache": false | true | [
                    "${_id}-${code}-hahha"
                ],
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
                    subs: {
                        label: "嵌套模型",
                        ctrltype: 'subema',
                        show: false,
                        subema: [{
                            orgs: {
                                type: String,
                                label: "关联机构",
                                ctrltype: 'boolean-checkbox',
                                ajax: {
                                    ref: 'preset-org',
                                    url: '',
                                    value: '_id',
                                    display: 'code',
                                    template: '${code} | ${name}',
                                    size: 10,
                                    flag: 0//0分页，1全部
                                }
                            },
                            users: {
                                type: String,
                                label: "用户",
                                ctrltype: 'boolean-radios',
                                ajax: {
                                    ref: 'preset-user',
                                    url: '',
                                    value: '_id',
                                    display: 'code',
                                    size: 2,
                                    flag: 1//0分页，1全部
                                }
                            },
                            reforg: {
                                type: String,
                                label: "引用组织",
                                ctrltype: 'ref',
                                ref: 'preset-org',
                                refOptions: {
                                    value: '_id',
                                    display: 'name',
                                    code: 'code',
                                    template: '${code} | ${name}',
                                }
                            },
                            reforgs: {
                                type: String,
                                label: "引用多选组织",
                                ctrltype: 'refs',
                                ref: 'preset-org',
                                refOptions: {
                                    value: '_id',
                                    display: 'code',
                                    name: 'name',
                                    template: '${code} | ${name}'
                                }
                            },
                            no: {
                                type: String,
                                label: "编号"
                            },
                            amount: {
                                type: Number,
                                ctrltype: 'number',
                                label: "数量"
                            }
                        }]
                    },
                    date: {
                        type: String,
                        label: "日期",
                        ctrltype: 'date',
                        default: function () {
                            let date = moment().format('ll');
                            return date;
                        },
                        updated: () => {
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
                            name: 'name',
                            template: '${code} | ${name}',
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
                    }
                }
            },
            {
                "code": "message",
                "label": "消息管理",
                "query": {
                    "fast": "title"
                },
                "fields": {
                    type: {
                        type: String,
                        label: "消息类型",
                        required: "消息类型({PATH})不能为空",
                        ctrltype: 'boolean-radios',
                        ajax: {
                            ref: 'preset-msgtype',
                            value: '_id',
                            display: 'code',
                            size: 30,
                            flag: 1//0分页，1全部
                        }
                    },
                    title: {
                        type: String,
                        label: "消息标题",
                        required: "消息标题({PATH})不能为空"
                    },
                    content: {
                        type: String,
                        label: "消息内容",
                        ctrltype: 'editor',
                        required: "消息内容({PATH})不能为空"
                    }
                }
            },
            {
                "code": "msgtype",
                "label": "消息类型",
                "query": {
                    "fast": "code,name"
                },
                "fields": {
                    code: {
                        type: String,
                        label: "类型编码",
                        required: "类型编码({PATH})不能为空"
                    },
                    name: {
                        type: String,
                        label: "类型名称",
                        required: "类型名称({PATH})不能为空"
                    }
                }
            },
            {
                "code": "task",
                "label": "任务管理",
                "query": {
                    "fast": "spec,name"
                },
                "fields": {
                    name: {
                        type: String,
                        label: "任务名称",
                        required: "名称({PATH})不能为空"
                    },
                    spec: {
                        type: String,
                        label: "任务规则",
                        required: "规则({PATH})不能为空"
                    },
                    status: {
                        type: String,
                        label: "任务状态",
                        required: "状态({PATH})不能为空",
                        ctrltype: 'boolean-radios', items: {
                            '0': '已停止', '1': '启动中'
                        },
                        default: '0'
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
                        // if (admins.indexOf(username) == -1) return res.json({err: {message: "对不起，" + username + "为非管理帐号，请联系管理员对该帐号授权或使用已授权的管理帐号进行登录"}});
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
                "post": {
                    handler: function (req, res) {
                        const access_token = req.query.access_token || req.body.access_token;
                        ibird.token.remove(access_token);
                        return res.json({message: '退出成功'});
                    }
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