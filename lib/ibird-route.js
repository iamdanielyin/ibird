/**
 * 模型路由注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const _ = require('underscore');
const authMiddleware = require('./middleware/auth');
const log = require('./ibird-log')(module);

/**
 * 默认路由验证声明
 * @param routesAuthDeclrString 默认路由验证声明
 * @returns {Array} 元素大写的数组
 */
function transformDeclrStringToArray(routesAuthDeclrString) {
    if (!routesAuthDeclrString) return [];
    const methods = [];
    routesAuthDeclrString.split(',').map(function (method) {
        if (!method) return;
        methods.push(method.toUpperCase());
    });
    return methods;
}
/**
 * 转换结果为toObject格式
 * @param result
 */
function transformToObject(result) {
    if (!_.isArray(result)) return result.toObject();
    const rets = [];
    result.map(function (obj) {
        rets.push(obj.toObject());
    });
    return rets;
}

/**
 * 根据schema.paths生成默认的查询条件
 * @param paths
 * @param keyword 关键字
 */
function defaultFindCondition(paths, keyword) {
    const condition = [];
    Object.keys(paths).map(function (key) {
        //TODO 去掉密码类型
        if (paths[key].instance != 'String' || ['ts', 'dr', '__v', '_id'].indexOf(key) != -1)  return;
        const object = {};
        object[key] = new RegExp(keyword);
        condition.push(object);
    });
    return {$or: condition};
}
/**
 * 路由注册
 * @param app Express应用实例
 * @param key 模型编码，规则为：模块编码_模型编码
 * @param Model 模型对象
 * @param routesAuthDeclrString 默认路由验证声明
 * @returns {{}}
 */
function registerRoutes(app, key, Model, routesAuthDeclrString) {
    const splitIndex = key.indexOf('_');
    const moduleCode = key.substring(0, splitIndex);
    const modelCode = key.substring(splitIndex + 1);
    const methods = transformDeclrStringToArray(routesAuthDeclrString);
    //默认鉴权
    app.all('/' + moduleCode + '/' + modelCode, function (req, res, next) {
        if (methods.length == 0) return next('route');//不作任何验证直接进到模型操作路由
        return (methods.indexOf(req.method) != -1) ? next() : next('route');//存在验证时，进入验证中间件，否则进入操作路由
    }, authMiddleware);
    app.post('/' + moduleCode + '/' + modelCode, function (req, res) {
        Model.create(req.body, function (err, result) {
            if (err) {
                log.error('创建对象异常<' + modelCode + '>:' + JSON.stringify(err));
                return res.json({err: {message: '服务器内部错误', detail: err}});
            }
            return res.json(transformToObject(result));
        });
    });
    app.delete('/' + moduleCode + '/' + modelCode, function (req, res) {
        Model.remove(req.body, function (err, result) {
            if (err) {
                log.error('删除对象异常<' + modelCode + '>:' + JSON.stringify(err));
                return res.json({err: {message: '服务器内部错误', detail: err}});
            }
            return res.json(result);
        });
    });
    app.put('/' + moduleCode + '/' + modelCode, function (req, res) {
        Model.update(req.body.cond, req.body.doc, function (err, result) {
            if (err) {
                log.error('更新对象异常<' + modelCode + '>:' + JSON.stringify(err));
                return res.json({err: {message: '更新对象异常', detail: err}});
            }
            return res.json(transformToObject(result));
        });
    });
    app.get('/' + moduleCode + '/' + modelCode, function (req, res) {
        const keyword = req.query.keyword || '';
        const conditions = keyword ? defaultFindCondition(Model.schema.paths, keyword) : {};// _.omit(req.query, 'flag', 'page', 'size', 'sort');
        const query = Model.find(conditions);
        const flag = parseInt(req.query.flag) || 0;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 20;
        const sort = req.query.sort;
        if (flag != 1) query.skip((page > 0 ? page - 1 : 0) * size).limit(size);
        query.sort(sort).exec(function (err, result) {
            if (err) {
                log.error('查询对象异常<' + modelCode + '>:' + JSON.stringify(err));
                return res.json({err: {message: '服务器内部错误', detail: err}});
            }
            Model.count(conditions, function (err, count) {
                if (err) {
                    log.error('查询对象异常<' + modelCode + '>:' + JSON.stringify(err));
                    return res.json({err: {message: '服务器内部错误', detail: err}});
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
    });
    app.get('/' + moduleCode + '/' + modelCode + '/:id', function (req, res) {
        const id = req.params.id;
        if (!id) return res.json({error: '查询参数异常', detail: '未指定ID'});
        Model.findById(id, function (err, result) {
            if (err) {
                log.error('查询对象异常<' + modelCode + '>:' + JSON.stringify(err));
                return res.json({err: {message: '服务器内部错误', detail: err}});
            }
            return res.json(transformToObject(result));
        });
    });
}

module.exports = registerRoutes;
