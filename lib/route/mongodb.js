/**
 * MongoDB模型路由注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const path = require('path');
const _ = require('lodash');
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
 */
function defaultFindCondition(schema, paths, keyword) {
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
    return {$or: condition};
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
 */
function population(paths, query) {
    Object.keys(paths).forEach(function (key) {
        const options = paths[key].options;
        // if (['ref', 'refs'].indexOf(paths[key].options.ctrltype) == -1)  return;
        if (!options.ref) return;
        const select = _.values((options.refOptions || {}));
        query.populate(key, select.join(' '), paths[key].options.ref);
        if (_.isFunction(options.population)) options.population(query);
    });
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
    Model.create(req.body, function (err, result) {
        if (err) {
            log.error(i18n.value('log_create_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_create_object_error'), detail: err}});
        }
        return res.json(transformToObject(result));
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
    Model.remove(req.body, function (err, result) {
        if (err) {
            log.error(i18n.value('log_delete_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_delete_object_error'), detail: err}});
        }
        return res.json(result);
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
    //TODO 过滤特殊字段，以防特殊字段被修改覆盖
    Model.update(req.body.cond, req.body.doc, function (err, result) {
        if (err) {
            log.error(i18n.value('log_update_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_update_object_error'), detail: err}});
        }
        return res.json(result);
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
    const conditions = keyword ? defaultFindCondition(schema, Model.schema.paths, keyword) : {};// _.omit(req.query, 'flag', 'page', 'size', 'sort');
    const query = Model.find(conditions);
    const flag = parseInt(req.query.flag) || 0;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const sort = req.query.sort;
    if (flag != 1) query.skip((page > 0 ? page - 1 : 0) * size).limit(size);
    population(Model.schema.paths, query);
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
            return res.json(data);
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
    const query = (true != schema.singleton) ? Model.findOne({}) : Model.findById(id);
    population(Model.schema.paths, query);
    query.exec(function (err, result) {
        if (err) {
            log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
        }
        return res.json(transformToObject(result));
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
    const schema = object.schema;
    const modelCode = object.modelCode;
    const _ids = req.body._ids ? req.body._ids.split(',') : null;
    const template = req.body.template;
    const query = Model.find({});
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
        if (updateArray.length == 0) return res.json(data);

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
                if (index >= end) return res.json(data);
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
    const _ids = req.body._ids ? req.body._ids.split(',') : null;
    const template = req.body.template;
    const query = Model.find({});
    const key = '_id';

    const header = _.keys(schema.fields);
    if (key && header.indexOf(key) == -1) header.unshift(key);
    if ('1' == template) {
        const data = excel.export(null, {
            name: modelCode,
            data: [header]
        });
        res.set({
            "Content-Type": "application/octet-stream;",
            'Content-disposition': `attachment; filename=${modelCode}.xlsx`
        });
        return res.end(data);
    }
    population(Model.schema.paths, query);
    query.exec(function (err, result) {
        if (err) {
            log.error(i18n.value('log_read_object_error', [modelCode, JSON.stringify(err)]));
            return res.json({err: {message: i18n.value('res_read_object_error'), detail: err}});
        }
        const data = excel.export(null, {
            name: modelCode,
            header: [header],
            json: true,
            data: result
        });
        res.set({
            "Content-Type": "application/octet-stream;",
            'Content-disposition': `attachment; filename=${modelCode}.xlsx`
        });
        res.end(data);
    });
};