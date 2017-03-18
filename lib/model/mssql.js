/**
 * SQLServer适配器
 * Created by yinfxs on 16-10-4.
 */

'use strict';

const _ = require('lodash');
const sql = require('mssql');
const pool = require('../utils/db/mssql');
const i18n = require('../utils/i18n');
const log = require('../utils/log');
const logger = log(module);

const app = {items: []};

module.exports = app;

/**
 * 主键检测：如果不存在则添加默认主键_id
 * @param table 表对象
 * @param schema 表对象
 * @returns {*}
 */
app.ensurePrimaryKey = function (table, schema) {
    if (!table || !table.columns || !_.isArray(table.columns)) return table;
    let hasPrimaryKey = false;
    let primaryKey = '';
    table.columns.forEach(function (column) {
        if (column.primary == true) {
            primaryKey = column.name;
            return hasPrimaryKey = true;
        }
    });
    if (!hasPrimaryKey) {
        primaryKey = schema._id || '_id';
        table.columns.add(primaryKey, sql.NVarChar(255), {nullable: false, primary: true});
    }
    return primaryKey;
};


/**
 * 过滤已经存在的表对象
 * @param tables 表数组
 */
app.existsFilter = function (tables, callback) {
    pool.getConnection().then(function (conn) {
        let names = tables.map(item=> "'" + item.name + "'");
        const command = "SELECT name FROM sysobjects WHERE name in (" + names.join(',') + ") AND type = 'U'";
        new sql.Request(conn).query(command).then((rs) => {
            callback(null, tables.map((item) => {
                let exists = false;
                rs.forEach(rsitem => {
                    if (rsitem.name == item.name) return exists = true;
                });
                return exists == false ? item : null;
            }));
        }).catch(callback);
    });
};
/**
 * 创建SQLServer表
 * @param tables 建表SQL数组
 */
app.createTables = function (tables, callback) {
    pool.transaction(tables.join(';'), null, function (err) {
        logger.error(i18n.value('mssql_error', ['建表异常，' + err]));
        if (_.isFunction(callback)) callback();
    });
};

/**
 * 模型注册
 * @param mdl 所属模块对象
 * @param schema 单个schema部分
 * @param models 模型搜集器
 */
app.schema = function (mdl, schema, models, create) {
    const name = schema.table || mdl.code + '_' + schema.code;
    const table = new sql.Table(name);
    table.create = true;
    Object.keys(schema.fields).forEach(function (code) {
        const value = schema.fields[code];
        const mssql = value.mssql || {};
        const column = mssql.column || code;
        let type = mssql.type, options = mssql.options;
        if (!type) {
            const jstype = _.keys(value) && _.keys(value).length > 0 ? value.type : value;
            switch (jstype) {
                case String:
                    type = sql.NVarChar(255);
                    break;
                case Number:
                    type = sql.NVarChar(255);
                    break;
                case Date:
                    type = sql.DateTime;
                    break;
                case Boolean:
                    type = sql.Bit;
                    break;
                default:
                    type = sql.NVarChar(255);
                    break;
            }
            if (['textarea', 'editor'].indexOf(value.ctrltype) != -1) type = sql.NVarChar(4000);
        }
        if (!options || !_.keys(options) || _.keys(options).length == 0) options = {nullable: (value.required ? false : true)};
        table.columns.add(column, type, options);
    });
    let primaryKey = '';
    //判断是否有主键
    if (create == undefined || create == true) {
        primaryKey = app.ensurePrimaryKey(table, schema);
        app.items.push(table);//添加对象到搜集数组中
    }
    //添加到模型搜集器
    models[mdl.code + '-' + schema.code] = {
        type: 'mssql',
        value: table,
        schema: schema,
        mdlcode: mdl.code,
        primaryKey: primaryKey
    };
    return table;
};

/**
 * 回调处理
 * @param callback 回调函数
 */
app.callback = function (callback) {
    const items = app.items;
    if (!items || items.length == 0) return;
    //判断SQLServer表是否存在
    app.existsFilter(items, function (err, tables) {
        if (err) return logger.error(i18n.value('mssql_error', ['检测表是否存在异常，' + err]));
        const commands = tables.map(function (table) {
            if (!table || !table.declare) return;
            return table.declare();
        });
        app.createTables(commands, callback);//执行建表语句
        app.items = [];//清空搜集对象
    });
};