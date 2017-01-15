/**
 * MongoDB模型路由注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const fsx = require('fs-extra');
const assign = require('object-assign');
const mongoose = require('mongoose');
const i18n = require('../utils/i18n');
const excel = require('../utils/excel');
const log = require('../utils/log')(module);

const app = {};

exports = module.exports = app;


/**
 * 转换结果为toObject格式
 * @param result
 */
function transformToObject(result) {
    if (!result) return result;
    if (!_.isArray(result)) return result.toObject();
    const rets = [];
    result.forEach(function (obj) {
        rets.push(obj.toObject());
    });
    return rets;
}


/**
 * 根据schema.paths生成默认的查询条件
 * @param paths
 * @param keyword 关键字
 * @param join 条件连接方式
 */
function defaultFindCondition(schema, paths, keyword) {
    keyword = keyword.trim();
    const query = schema.query || {};
    if (_.isFunction(query.custom)) return query.custom({paths: paths, schema: schema, keyword: keyword});
    const condition = [];
    paths = filterUnFastFields(query.fast, paths);
    Object.keys(paths).forEach(function (key) {
        if (paths[key].instance != 'String' || paths[key].options.ctrltype == 'password' || ['ts', 'dr', '__v', '_id'].indexOf(key) != -1)  return;
        const object = {};
        object[key] = new RegExp(keyword);
        condition.push(object);
    });
    return query.fast ? {$and: [{$or: condition}]} : {$or: condition};
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
 * 对引用字段进行populate处理
 * @param paths
 * @param query
 * @param schema
 */
function population(paths, query, schema) {
    Object.keys(paths).forEach(function (key) {
        const options = paths[key].options;
        if (!options.ref) return;
        const select = _.values((options.refOptions || {}));
        if (['ref', 'refs'].indexOf(paths[key].options.ctrltype) == -1) return;
        query.populate(key, select.join(' '), paths[key].options.ref);
        if (_.isFunction(options.population)) options.population(query);
    });
}

/**
 * 设置引用数据null值
 * @param schema
 * @param data
 * @returns {*[]|*}
 */
function setRefvaluesNull(schema, data) {
    data = _.isArray(data) ? data : [data];
    data.forEach((item, i) => {
        _.keys(schema.fields).forEach(key => {
            const field = schema.fields[key];
            if (!field.ref || _.isArray(item[key]) || item[key]) return;
            item[key] = null;
            data[i] = item;
        });
    });
    return data;
}

/**
 * 新增操作
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.create = function (object, req, res) {
    const Model = object.Model;
    const modelCode = object.modelCode;
    const schema = object.schema;
    const hooks = schema.hooks || {};
    if (!_.isFunction(hooks["pre-create"])) hooks["pre-create"] = (data, callback) => callback(data);
    const body = setRefvaluesNull(schema, req.body);
    hooks["pre-create"](body, (body) => {
        Model.create(body, (err, result) => {
            if (err) {
                log.error(i18n.value('log_create_object_error', [modelCode, JSON.stringify(err)]));
                return res.json({err: {message: i18n.value('res_create_object_error'), detail: err}});
            }
            result = transformToObject(result);
            if (!_.isFunction(hooks["post-create"])) hooks["post-create"] = data => data;
            hooks["post-create"](result);
            return res.json(assign(result, (res.data || {})));
        });
    });
};

/**
 * 删除操作
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.delete = function (object, req, res) {
    const Model = object.Model;
    const modelCode = object.modelCode;
    const schema = object.schema;
    const hooks = schema.hooks || {};
    if (!_.isFunction(hooks["pre-delete"])) hooks["pre-delete"] = (data, callback) => callback(data);
    hooks["pre-delete"](req.body, (body) => {
        Model.remove(body, function (err, result) {
            if (err) {
                log.error(i18n.value('log_delete_object_error', [modelCode, JSON.stringify(err)]));
                return res.json({err: {message: i18n.value('res_delete_object_error'), detail: err}});
            }
            if (!_.isFunction(hooks["post-delete"])) hooks["post-delete"] = data => data;
            hooks["post-delete"](result);
            return res.json(assign(result, (res.data || {})));
        });
    });
};

/**
 * 更新操作
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.update = function (object, req, res) {
    const Model = object.Model;
    const modelCode = object.modelCode;
    const schema = object.schema;
    const fields = schema.fields;
    const hooks = schema.hooks || {};
    if (!_.isFunction(hooks["pre-update"])) hooks["pre-update"] = (data, callback) => callback(data);
    //TODO 过滤特殊字段，以防特殊字段被修改覆盖
    hooks["pre-update"](req.body, (body) => {
        Model.findOne(body.cond, function (err, result) {
            _.keys(body.doc).forEach(key => {
                if (['created', 'creater'].indexOf(key) != -1) return;//过滤创建人、创建时间字段
                const field = fields[key];
                if (!field) return;
                const value = body.doc[key];
                if (['modified', 'modifier', 'dr'].indexOf(key) != -1 && !value) return;
                if ('password' == field.ctrltype && !value) return;
                result[key] = value;
            });
            result.save((err, result) => {
                if (err) {
                    log.error(i18n.value('log_update_object_error', [modelCode, JSON.stringify(err)]));
                    return res.json({err: {message: i18n.value('res_update_object_error'), detail: err}});
                }
                if (!_.isFunction(hooks["post-update"])) hooks["post-update"] = data => data;
                hooks["post-update"](result);
                return res.json(assign(result, (res.data || {})));
            });
        });
    });
};
/**
 * 列表查询
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.list = function (object, req, res) {
    const Model = object.Model;
    const schema = object.schema;
    const modelCode = object.modelCode;
    const keyword = req.query.keyword || '';
    const hooks = schema.hooks || {};
    if (!_.isFunction(hooks["pre-list"])) hooks["pre-list"] = (req, conds, callback) => callback(conds);
    let cond = req.query.cond || {};//自定义查询条件
    cond = _.isObject(cond) ? cond : JSON.parse(cond);
    const def = req.query.def;//完全自定义查询标识，该参数如果有值，则不在拼接关进字查询条件
    let conditions = def ? cond : (keyword ? defaultFindCondition(schema, Model.schema.paths, keyword) : {});
    if (cond && _.keys(cond).length > 0) {
        const $or = cond['$or'] || [];
        const $and = cond['$and'] || [];
        conditions['$or'] = $or.concat(conditions['$or'] || []);
        conditions['$and'] = $and.concat(conditions['$and'] || []);
        assign(conditions, _.omit(cond, '$or', '$and'));
    }
    if (req.authscope) {
        const $or = req.authscope['$or'] || [];
        const $and = req.authscope['$and'] || [];
        conditions['$or'] = $or.concat(conditions['$or'] || []);
        conditions['$and'] = $and.concat(conditions['$and'] || []);
        assign(conditions, _.omit(req.authscope, '$or', '$and'));
    }
    if (conditions['$or'] && conditions['$or'].length == 0) conditions = _.omit(conditions, '$or');
    if (conditions['$and'] && conditions['$and'].length == 0) conditions = _.omit(conditions, '$and');
    hooks["pre-list"](req, conditions, (conditions) => {
        const query = Model.find(conditions);
        const flag = parseInt(req.query.flag) || 0;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 20;
        const sort = (req.query.sort || (schema.query ? schema.query.sort : "")) + " -modified -created";//按修改时间逆序
        if (flag != 1) query.skip((page > 0 ? page - 1 : 0) * size).limit(size);
        population(Model.schema.paths, query, schema);
        query.sort(sort).exec(function (err, result) {
            if (err) {
                log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
                return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
            }
            Model.count(conditions, function (err, count) {
                if (err) {
                    log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
                    return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
                }
                let data = {
                    data: transformToObject(result),
                    totalelements: count,
                    flag: flag,
                    sort: sort,
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
                return res.json(assign(data, (res.data || {})));
            });
        });
    });
};

/**
 * 根据ID查询单个对象
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.one = function (object, req, res) {
    const Model = object.Model;
    const schema = object.schema;
    const modelCode = object.modelCode;
    const id = req.params.id;
    if (!id && true != schema.singleton) return res.json({
        error: i18n.value('query_param_error'),
        detail: i18n.value('not_specified_id')
    });
    const query = (true == schema.singleton) ? Model.findOne({}) : Model.findById(id);
    population(Model.schema.paths, query, schema);
    query.exec(function (err, result) {
        if (!result) return res.json(assign({}, (res.data || {})));
        if (err) {
            log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
        }
        result = transformToObject(result);
        return res.json(assign(result, (res.data || {})));
    });
};


/**
 * 模型导入
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.import = function (object, req, res) {
    const Model = object.Model;
    const modelCode = object.modelCode;
    const key = '_id';

    //获取文件地址
    const files = req.files ? req.files.importFiles : [];
    const file = _.isArray(files) && files.length > 0 ? files[0] : files;
    const file_path = file ? file.path : '';
    //解析文件
    const options = {};
    options[modelCode] = {
        json: true,
        keyRowIndex: 0
    };
    let data = excel.import(file_path, options) || {};
    data = data[modelCode] || [];
    //分开数据
    const insertArray = [];
    const updateArray = [];
    data.forEach((item) => {
        if (!item[key]) return insertArray.push(_.omit(item, '_id'));
        updateArray.push(item);
    });
    //执行新增操作
    Model.create(insertArray, function (err, result) {
        if (err) {
            log.error(i18n.value('log_create_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_create_object_error'), detail: err}});
        }
        if (updateArray.length == 0) return res.json(assign(data, (res.data || {})));

        let index = 0, end = updateArray.length;
        const update = function (item) {
            const cond = {};
            cond[key] = item[key];
            Model.update(cond, item, function (err, result) {
                ++index;
                if (err) {
                    log.error(i18n.value('log_update_object_error', [modelCode, JSON.stringify(err)]));
                    return res.json({err: {message: i18n.value('res_update_object_error'), detail: err}});
                }
                if (index >= end) return res.json(assign(data, (res.data || {})));
            });
        };
        updateArray.forEach(item => update(item));
    });
};

/**
 * 模型导出
 * @param object 查询信息
 * @param req 请求对象
 * @param res 响应对象
 */
app.export = function (object, req, res) {
    const Model = object.Model;
    const schema = object.schema;
    const modelCode = object.modelCode;
    const _ids = req.body._ids ? req.body._ids.split(',') : [];
    const all = req.body.all;
    const template = req.body.template;
    const condition = all == '1' ? {} : {_id: {$in: _ids}};//如果all==1则查询全部，否则按id查询指定文档
    const query = Model.find(condition);
    const key = '_id';

    let header = _.keys(schema.fields);
    if ('1' == template) {
        if (key && header.indexOf(key) == -1) header.unshift(key);
        excel.resexp(`${schema.label || modelCode}.xlsx`, {
            name: modelCode,
            data: [header]
        }, res);
        return;
    }
    population(Model.schema.paths, query, schema);
    query.exec(function (err, result) {
        if (err) {
            log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
        }
        const keys = [], displays = [];
        _.keys(schema.fields).forEach(key => {
            const field = schema.fields[key];
            if (!field || !field.label) return;
            keys.push(key);
            displays.push(field.label);
        });
        result.forEach(item => {
            item.created = moment(item.created, 'x').format('YYYY-MM-DD HH:mm:ss');
            item.modified = moment(item.modified, 'x').format('YYYY-MM-DD HH:mm:ss');
        });
        const config = {
            name: modelCode,
            json: true,
            header: [keys, displays],
            keyRowIndex: 0,
            displayRowIndex: 1,
            data: result
        };
        excel.resexp(`${schema.label || modelCode}.xlsx`, config, res);
    });
};