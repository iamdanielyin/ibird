/**
 * 模型路由注册
 * Created by yinfxs on 16-5-31.
 */

'use strict';

const _ = require('underscore');
const log = require('./ibird-log')(module);

/**
 * 路由注册
 * @param app Express应用实例
 * @param key 模型编码，规则为：模块编码_模型编码
 * @param Model 模型对象
 * @returns {{}}
 */
function registerRoutes(app, key, Model) {
    const splitIndex = key.indexOf('_');
    const moduleCode = key.substring(0, splitIndex);
    const modelCode = key.substring(splitIndex + 1);
    app.route('/' + moduleCode + '/' + modelCode)
        .post(function (req, res) {
            Model.create(req.body, function (err, result) {
                if (err) {
                    log.error('创建对象异常<' + modelCode + '>:' + JSON.stringify(err));
                    return res.json({error: '服务器内部错误', detail: err});
                }
                return res.json(result);
            });
        })
        .delete(function (req, res) {
            Model.remove(req.query, function (err, result) {
                if (err) {
                    log.error('删除对象异常<' + modelCode + '>:' + JSON.stringify(err));
                    return res.json({error: '服务器内部错误', detail: err});
                }
                return res.json(result);
            });
        })
        .put(function (req, res) {
            Model.update(req.body.cond, req.body.doc, function (err, result) {
                if (err) {
                    log.error('更新对象异常<' + modelCode + '>:' + JSON.stringify(err));
                    return res.json({error: '更新对象异常', detail: err});
                }
                return res.json(result);
            });
        })
        .get(function (req, res) {
            const conditions = _.omit(req.query, 'flag', 'page', 'size', 'sort', 'm');
            const query = Model.find(conditions);
            const flag = parseInt(req.query.flag) || 0;
            const page = parseInt(req.query.page) || 0;
            const size = parseInt(req.query.size) || 20;
            const sort = req.query.sort;
            if (flag != 1) query.skip(page * size).limit(size);
            query.sort(sort).exec(function (err, result) {
                if (err) {
                    log.error('查询对象异常<' + modelCode + '>:' + JSON.stringify(err));
                    return res.json({error: '服务器内部错误', detail: err});
                }
                Model.count(conditions, function (err, count) {
                    if (err) {
                        log.error('查询对象异常<' + modelCode + '>:' + JSON.stringify(err));
                        return res.json({error: '服务器内部错误', detail: err});
                    }
                    let data = {
                        data: result,
                        totalels: count,
                        flag: flag,
                        sort: sort,
                        start: 0,
                        end: count
                    };
                    if (flag != 1) {
                        data.page = page;
                        data.size = size;
                        data.totalpgs = Math.ceil(count / size);
                        data.start = page * size;
                        let end = data.start + size;
                        data.end = end > data.totalels ? data.totalels : end;
                    }
                    return res.json(data);
                });
            });
        });
}

module.exports = registerRoutes;
