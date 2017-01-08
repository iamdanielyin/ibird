/**
 * 模型适配器
 * Created by yinfxs on 16-10-4.
 */

'use strict';

const _ = require('lodash');
const assign = require('object-assign');
const moment = require('moment');
const utility = require('../utils/utility');
const mongodb = require('./mongodb');
const mssql = require('./mssql');

const app = {};

module.exports = app;

/**
 * 模型注册
 * @param ds 全局数据源
 * @param modules 模块配置部分
 * @param models 模型搜集器
 * @param callback 回调函数
 */
app.init = (ds, modules, models, callback) => {
    modules.forEach(function (mdl) {
        if (!mdl) return;
        const moduleConfig = mdl.config || {};
        ds = moduleConfig.ds || ds;
        mdl.schemas.forEach(function (schema) {
            const schemaConfig = schema.config || {};
            let create = mdl.create;
            ds = schemaConfig.ds || ds;
            switch (ds) {
                case 'mongodb':
                    mongodb.schema(mdl, schema, models);
                    break;
                case 'mssql':
                    create = (schema.create == undefined) ? create : schema.create;
                    mssql.schema(mdl, schema, models, create);
                    break;
                case 'mysql':
                    // mysql.schema(mdl, schema);
                    break;
            }
        });
    });
    mssql.callback(callback);
    mongodb.callback(callback);
};

/**
 * 添加所有默认字段
 * @param modules
 */
app.schemaDefaults = (modules) => {
    if (!_.isArray(modules) || modules.length == 0) return;
    modules.forEach(function (mdl) {
        if (!mdl) return;
        mdl.schemas.forEach(function (schema) {
            app.schemaDefault(schema);
        });
    });
    return modules;
};

/**
 * 添加默认字段
 * @param schema
 * @returns {*}
 */
app.schemaDefault = (schema) => {
    if (!schema || !schema.fields) return schema;
    if (schema.archive) {
        schema.fields['code'] = assign({
            type: String,
            label: "编码",
            unique: true,
            required: "编码({PATH})不能为空",
            index: true
        }, (schema.fields['code'] || {}));
        schema.fields['name'] = assign({
            type: String,
            label: "名称",
            required: "名称({PATH})不能为空"
        }, (schema.fields['name'] || {}));
    }
    schema.fields['org'] = assign({
        type: String,
        label: "所属机构",
        ctrltype: 'ref',
        ref: 'preset-org',
        refOptions: {
            value: '_id',
            display: 'name',
            code: 'code',
            template: '${code} | ${name}',
        }
    }, (schema.fields['org'] || {}));
    schema.fields['creater'] = assign({
        type: String,
        label: "创建人",
        required: true,
        disabled: true,
        ctrltype: 'ref',
        ref: 'preset-user',
        refOptions: {
            value: '_id',
            display: 'code',
            name: 'name',
            template: '${code} | ${name}'
        }
    }, (schema.fields['creater'] || {}));
    schema.fields['modifier'] = assign({
        type: String,
        label: "修改人",
        required: true,
        disabled: true,
        ctrltype: 'ref',
        ref: 'preset-user',
        refOptions: {
            value: '_id',
            display: 'code',
            name: 'name',
            template: '${code} | ${name}'
        }
    }, (schema.fields['modifier'] || {}));
    schema.fields['created'] = assign({
        type: String,
        label: "创建时间",
        required: true,
        disabled: true,
        default: () => moment().format('x')
    }, (schema.fields['created'] || {}));
    schema.fields['modified'] = assign({
        type: String,
        label: "修改时间",
        required: true,
        disabled: true,
        default: () => moment().format('x'),
        updated: () => moment().format('x')
    }, (schema.fields['modified'] || {}));
    schema.fields['dr'] = assign({
        type: String,
        label: "删除标记",
        required: true,
        disabled: true,
        ctrltype: 'boolean-radios',
        items: {
            '0': '否', '1': '是'
        },
        default: '0'
    }, (schema.fields['dr'] || {}));
    schema.fields['remark'] = assign({
        type: String,
        label: "备注",
        ctrltype: 'textarea'
    }, (schema.fields['remark'] || {}));
    return schema;
};
