'use strict';

/**
 * 日志测试
 * Created by yinfxs on 2017/4/8.
 */

const path = require('path');
const app = require('ibird-core');
const docs = require('ibird-docs');

// 注册项测试
app.config({
    name: 'ibird管理应用',
    port: 3001,
    mongo: 'mongodb://127.0.0.1:27017/ibird',
    static: {
        '/public': path.resolve(process.cwd(), 'public')
    }
});

// 事件监听测试
app.config().trigger.on('ibird_app_start_success', () => {
    console.log('应用启动成功！');
});

// 模型注册测试
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        displayName: '账号',
        unique: true,
        required: '账号({PATH})不能为空',
        index: true
    },
    password: {
        type: String,
        displayName: '密码',
        required: '密码({PATH})不能为空'
    },
    roles: {
        type: [String],
        displayName: '角色列表'
    },
    name: {
        type: String,
        displayName: '昵称'
    },
    sex: {
        type: String,
        displayName: '性别',
        enum: ['男', '女']
    },
    avatar: {
        type: String,
        displayName: '头像'
    }, _org: {
        type: String,
        displayName: '所属机构'
    },
    _creator: {
        type: String,
        displayName: '创建人',
        ref: 'User'
    },
    _modifier: {
        type: String,
        displayName: '修改人',
        ref: 'User'
    },
    _created: {
        type: Number,
        displayName: '创建时间',
        remark: 'UNIX时间戳'
    },
    _modified: {
        type: Number,
        displayName: '修改时间',
        remark: 'UNIX时间戳'
    },
    _dr: {
        type: Boolean,
        displayName: '删除标记',
        default: false
    },
    _remark: {
        type: String,
        displayName: '备注'
    }
});

const blogSchema = new Schema({
    title: {
        type: String,
        displayName: '标题'
    },
    author: {
        type: String,
        displayName: '作者'
    },
    content: {
        type: String,
        displayName: '内容'
    }
});

// 挂载数据模型
app.model({ name: 'User', schema: userSchema, displayName: '用户' });
app.model({ name: 'Blog', schema: blogSchema, displayName: '博客' });

// 挂载自定义接口
app.mount((router) => {
    router.get('/test/api', (ctx) => {
        ctx.body = '测试自定义接口';
    });
});

// 应用启动测试
app.start().then(() => {
    // 生成接口文档
    docs.gen(app.config(), path.resolve(process.cwd(), 'public/api.raml'));
});



