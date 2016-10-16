/**
 * SQLServer模型路由注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const _ = require('underscore');
const uuid = require('node-uuid');
const mssql = require('../utils/mssql');
const i18n = require('../utils/i18n');
const log = require('../utils/log')(module);

const app = {};

exports = module.exports = app;

/**
 * 获取表对象的主键数组
 * @param table
 * @returns {Array}
 */
function primaryKeys(table) {
    const keys = [];
    if (!table || !table.columns || table.columns.length == 0) return keys;
    table.columns.map(function (column) {
        if (!column || column.primary != true) return;
        keys.push(column.name);
    });
    return keys;
}

/**
 * 默认查找对象
 * @param table
 * @param keyword
 * @returns {Array}
 */
function defaultFindCondition(table, schema, keyword) {
    const query = schema.query || {};
    if (_.isFunction(query.custom)) return query.custom({table: table, schema: schema, keyword: keyword});
    const conditions = [], fields = filterUnFastFields(query.fast, schema.fields);//默认查所有
    if (!table || !table.columns || table.columns.length == 0) return conditions;
    _.keys(fields).forEach(function (key) {
        if (fields[key].ctrltype && fields[key].ctrltype != 'string')return;
        conditions.push(`[${table.name}].[${key}] like '%${keyword}%'`);
    });
    return conditions;
}

/**
 * 过滤非快速查询列
 * @param fast
 * @param fields
 * @returns {*}
 */
function filterUnFastFields(fast, fields) {
    if (!fields || !fast || fast.trim().length == 0) return fields;
    const fastFields = {};
    const split = fast.split(',');
    _.keys(fields).forEach(function (key) {
        if (!key || split.indexOf(key) == -1) return;
        fastFields[key] = fields[key];
    });
    return fastFields;
}
/**
 * 设置主键默认值
 * @param table
 */
function defaultPrimaryKey(table) {
    if (!table || !table.rows || table.rows.length == 0) return;
    const keys = primaryKeys(table);
    table.rows.forEach(function (row) {
        keys.forEach(function (key) {
            if (row[key]) return;
            row[key] = uuid.v1();
        })
    });
}

/**
 * 生成sort部分
 * @param table
 * @param sort
 */
function sortPart(table, sort) {
    const result = [];
    if (!sort) return result;
    sort.split(' ').forEach(function (item) {
        if (!item) return;
        const positive = item.startsWith('-') ? `[${table.name}].[${item.substring(1, item.length)}] DESC` : `[${table.name}].[${item}]`
        result.push(positive);
    });
    return result;
}
/**
 * 生成join部分
 * @param table
 * @param schema
 */
function joinPart(table, schema) {
    const joins = [], fields = schema.fields;
    _.keys(schema.fields).forEach(function (code) {
        const field = fields[code];
        if (!field.ref || !field.refOptions || field.ctrltype != 'ref') return;
        const key = field.ref;
        const options = field.refOptions;
        const splitIndex = key.indexOf('-');
        const moduleCode = key.substring(0, splitIndex);
        const modelCode = key.substring(splitIndex + 1);

        const name = options.table || (moduleCode + '_' + modelCode);
        const alias = name + '_' + code;
        joins.push(`LEFT JOIN ${name} AS [${alias}] ON [${alias}].[${options.value}] = [${table.name}].[${code}]`);
    });
    return joins;
}
/**
 * 生成查询列部分
 * @param table
 * @param keys
 * @param schema
 * @returns {Array}
 */
function columnsPart(table, keys, schema) {
    const columns = [], fields = schema.fields;
    _.keys(schema.fields).forEach(function (code) {
        const field = fields[code];
        if (field.ref) {
            const key = field.ref;
            const refOptions = field.refOptions;
            const splitIndex = key.indexOf('-');
            const moduleCode = key.substring(0, splitIndex);
            const modelCode = key.substring(splitIndex + 1);

            const alias = (refOptions.table || (moduleCode + '_' + modelCode)) + '_' + code;
            switch (field.ctrltype) {
                case 'ref':
                    columns.push(`[${alias}].[${refOptions.value}] AS [${code}.${refOptions.value}]`);
                    columns.push(`[${alias}].[${refOptions.display}] AS [${code}.${refOptions.display}]`);
                    break;
                case 'refs':
                    columns.push(`[${table.name}].[${code}]`);
                    break;
            }
        } else {
            columns.push(`[${table.name}].[${code}]`);
        }
    });
    keys.forEach(function (code) {
        columns.push(`[${table.name}].[${code}]`);
    });
    return columns;
}

/**
 * 对结果进行populate处理
 * 1.对于单引用的，进行id值与对象值的替换
 * 2.对于多引用的，统计所有的id值，查询数据库后再进行ID值与对象的替换
 * @param schema
 * @param result
 * @param callback
 */
function population(schema, result, callback) {
    if (!schema || !result || result.length == 0) return callback(result);
    const fields = schema.fields;
    const tables = {};//统计需要查询的表与对应的ID值，{表名:{table:表名,columns:[列],id:ID列,values:[ID]}}
    const keys = {};
    Object.keys(fields).forEach(function (code) {
        const field = fields[code];
        if (!code || !field) return;
        if (['ref', 'refs'].indexOf(field.ctrltype) == -1 || !field.refOptions) return;
        const options = field.refOptions;
        if (field.ctrltype == 'ref') {
            result.forEach(function (item) {
                item[code] = {};
                item[code][options.value] = item[code + '.' + options.value];
                item[code][options.display] = item[code + '.' + options.display];
            });
        } else {
            const key = field.ref;
            const splitIndex = key.indexOf('-');
            const moduleCode = key.substring(0, splitIndex);
            const modelCode = key.substring(splitIndex + 1);

            const table = options.table || (moduleCode + '_' + modelCode);
            keys[code] = {table: table, fields: [options.value, options.display], id: options.value};
            const object = tables[table] || {table: table, columns: [], values: [], id: options.value};
            object.columns.push(options.value, options.display);
            object.columns = _.uniq(object.columns);
            tables[table] = object;
        }
    });
    if (tables.length == 0) return callback(result);

    //多引用查询的处理
    //1.查询前统计需要查询的表与对应的ID值
    beforeRefsQuery(result, keys, tables);
    //2.执行查询，通过将对应的表查询对应的列
    refsQuery(_.values(tables), {}, data => {
        //3.填充值
        afterRefsQuery(result, keys, data);
        callback(result);
    });
}


/**
 * 多引用查询
 * @param tables
 * @param done
 * @param callback
 */
function refsQuery(tables, data, callback) {
    if (!tables || tables.length == 0) return callback(data);
    const table = tables.pop();
    const command = `SELECT [${table.columns.join('],[')}] FROM [${table.table}] WHERE [${table.id}] in ('${table.values.join("','")}')`;
    mssql.query(command, function (rs) {
        data[table.table] = rs;
        refsQuery(tables, data, callback);
    }, function (err) {
        console.error(err);
        data[table.table] = [];
        refsQuery(tables, data, callback);
    });
}

/**
 * 多引用查询前处理
 * @param result
 * @param keys
 * @param tables
 */
function beforeRefsQuery(result, keys, tables) {
    result.forEach(function (item) {
        if (!item) return;
        _.keys(keys).forEach(function (key) {
            if (!item[key]) return;
            const table = keys[key].table;
            tables[table].values = tables[table].values.concat(item[key].split(','));
            tables[table].values = _.uniq(tables[table].values);
        });
    });
}

/**
 * 多引用查询后处理
 * @param result
 * @param keys
 * @param data
 */
function afterRefsQuery(result, keys, data) {
    result.forEach(item => {
        //循环行
        if (!item) return;
        //循环列
        _.keys(keys).forEach(key => {
            if (!item[key]) return;
            const keyValue = keys[key];
            const array = [];
            const idKey = keyValue.id;
            const fields = keyValue.fields;
            //取列值
            const values = data[keyValue.table];
            //设置列值
            const split = item[key].split(',');
            split.forEach(splitId => {
                values.forEach(value => {
                    if (value[idKey] != splitId) return;
                    const object = {};
                    fields.forEach(fieldKey => object[fieldKey] = value[fieldKey]);
                    array.push(object);
                });
            });
            item[key] = array;
        });
    });
}

/**
 * 设置默认值
 * @param schema 数据模型
 * @param result
 */
function defaultValue(schema, result) {
    if (!schema || !schema.fields || schema.fields.length == 0) return result;

    function set(object, key, value) {
        if (object[key]) return;
        if (_.isFunction(value)) {
            object[key] = value();
        } else {
            object[key] = value;
        }
    }

    _.keys(schema.fields).forEach(function (key) {
        const field = schema.fields[key];
        if (!key || !field) return;
        if (_.isArray(result)) {
            result.forEach(row => {
                set(row, key, field.default);
            });
        } else {
            set(result, key, field.default);
        }
    });
    return result;
}

/**
 * 新增操作
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.create = function (object, req, res) {
    const table = object.table;
    const modelCode = object.modelCode;
    const body = defaultValue(object.schema, req.body);
    table.rows = [];
    if (_.isArray(body)) {
        table.rows = body;
    } else if (_.isObject(body)) {
        table.rows = [body];
    }
    defaultPrimaryKey(table);
    mssql.bulk(table, function (rowCount) {
        return res.json({rowCount: rowCount});
    }, function (err) {
        log.error(i18n.value('log_create_object_error', [modelCode, JSON.stringify(err)]));
        return res.json({err: {message: i18n.value('res_create_object_error'), detail: err}});
    });
};

/**
 * 删除操作
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.delete = function (object, req, res) {
    const table = object.table;
    const modelCode = object.modelCode;
    const conditions = _.keys(req.body).map(function (key) {
        return `[${key}] in ('${req.body[key]['$in'].join("','")}')`;
    });
    mssql.transaction(`DELETE FROM ${table.name} WHERE ${conditions.join(' and ')}`, function (rs) {
        return res.json(_.isObject(rs) ? rs : {result: rs});
    }, function (err) {
        log.error(i18n.value('log_delete_object_error', [modelCode, JSON.stringify(err)]));
        return res.json({err: {message: i18n.value('res_delete_object_error'), detail: err}});
    });
};

/**
 * 更新操作
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.update = function (object, req, res) {
    const table = object.table;
    const modelCode = object.modelCode;
    const cond = req.body.cond || {};
    const doc = defaultValue(object.schema, req.body.doc) || {};
    const conditions = _.keys(cond).map(function (key) {
        return `[${key}]='${cond[key]}'`;
    });
    const pairs = _.keys(doc).map(function (key) {
        return `[${key}]='${doc[key]}'`;
    });
    const command = `UPDATE ${table.name} SET ${pairs.join(',')} WHERE ${conditions.join(' and ')}`;
    mssql.transaction(command, function () {
        return res.json(doc);
    }, function (err) {
        log.error(i18n.value('log_update_object_error', [modelCode, JSON.stringify(err)]));
        return res.json({err: {message: i18n.value('res_update_object_error'), detail: err}});
    });
};
/**
 * 列表查询
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.list = function (object, req, res) {
    const table = object.table;
    const modelCode = object.modelCode;
    const schema = object.schema;
    const keyword = req.query.keyword || '';
    const conditions = keyword ? defaultFindCondition(table, schema, keyword) : ['1=1'];
    const flag = parseInt(req.query.flag) || 0;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const keys = primaryKeys(table);
    const key = keys[0];//分页时子查询只查询主键，速度快
    const columns = columnsPart(table, keys, schema);
    const joins = joinPart(table, schema);

    let sort = sortPart(table, req.query.sort);
    let command = null;

    sort = (sort.length == 0) ? [`[${table.name}].[${key}]`] : sort;
    if (flag != 1) {
        //分页
        const start = (page - 1) * size + 1;
        const end = start + size - 1;
        command = `SELECT t1.*
        FROM [${table.name}] AS t1,
            (SELECT row_number() OVER (ORDER BY ${sort.join(',')} ) row_no, [${key}] FROM [${table.name}]) AS t2
        WHERE t1.[${key}] = t2.[${key}]
        AND t2.row_no BETWEEN ${start} AND ${end}`;
    } else {
        //全部查询
        command = `SELECT ${columns.join(',')} FROM ${table.name} ${joins.join(' ')} WHERE ${conditions.join(' or ')} ORDER BY ${sort.join(',')}`;
    }

    mssql.query(command, function (result) {
        population(schema, result, function (result) {
            mssql.query(`SELECT COUNT(${key}) AS counts FROM ${table.name} WHERE ${conditions.join(' or ')}`, function (rs) {
                const count = rs && rs.length > 0 ? rs[0].counts : 0;
                let data = {
                    data: result,
                    totalelements: count,
                    flag: flag,
                    sort: req.query.sort,
                    keyword: keyword,
                    start: 1,
                    end: count
                };
                if (flag != 1) {
                    data.page = page;
                    data.size = size;
                    data.totalpages = Math.ceil(count / size);
                    data.start = page > data.totalpages ? 0 : ((page - 1) * size + 1);
                    data.end = page > data.totalpages ? 0 : (data.start + size - 1);
                    data.end = data.end > data.totalelements ? data.totalelements : data.end;
                }
                return res.json(data);
            }, function (err) {
                log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
                return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
            });
        });
    }, function (err) {
        log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
        return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
    });
};

/**
 * 通过ID查询到那个对象
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*}
 */
app.one = function (object, req, res) {
    const id = req.params.id;
    if (!id) return res.json({error: i18n.value('query_param_error'), detail: i18n.value('not_specified_id')});
    const table = object.table;
    const modelCode = object.modelCode;
    const schema = object.schema;
    const keys = primaryKeys(table);
    const columns = columnsPart(table, keys, schema);
    const joins = joinPart(table, schema);
    const conditions = _.keys(keys).map(function (i) {
        return `[${table.name}].[${keys[i]}]='${id}'`;
    });
    const command = `SELECT ${columns.join(',')} FROM ${table.name} ${joins.join(' ')} WHERE ${conditions.join(' and ')}`;
    mssql.query(command, function (rs) {
        population(schema, rs, function (rs) {
            rs = rs && rs.length > 0 ? rs[0] : rs;
            return res.json(rs);
        });
    }, function (err) {
        log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
        return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
    });
};