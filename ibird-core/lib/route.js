'use strict';


/**
 * 路由部分
 * Created by yinfxs on 2017/4/5.
 */

const model = require('./model');
const utility = require('ibird-utils');
const logger = require('./log')();
const config = require('./config');
const middlewares = {
    list: require('./route/list'),
    one: require('./route/one'),
    id: require('./route/id'),
    create: require('./route/create'),
    update: require('./route/update'),
    remove: require('./route/remove')
};
const app = {};

module.exports = app;

/**
 * 生成模型默认路由
 * @param router
 */
app.model = (router, item) => {
    const { name } = item;
    const { defaultRouteOverrite: _m_overrite = {}, defaultRouteHooks: _m_hooks = {} } = item;
    const { defaultRouteOverrite: _g_overrite = {}, defaultRouteHooks: _g_hooks = {} } = config;
    const path = name.toLowerCase();
    const defaultApiPrefix = config.defaultApiPrefix || '';

    for (const key of ['list', 'one', 'id', 'create', 'update', 'remove']) {
        if (_m_overrite[key] === false || _g_overrite[key] === false) continue;

        const fn = _m_overrite[key] || _g_overrite[key];
        const { pre: modelpre, post: modelpost } = _m_hooks[key] || {};
        const { pre: globalpre, post: globalpost } = _g_hooks[key] || {};

        let middleware = middlewares[key](name, [globalpre, modelpre], [globalpost, modelpost]);
        middleware = (typeof fn === 'function') ? fn : middleware;

        switch (key) {
            case 'list':
                //外部路由：列表查询接口
                router.get(`${defaultApiPrefix}/${path}`, middleware);
                break;
            case 'one':
                //外部路由：单个查询接口
                router.get(`${defaultApiPrefix}/${path}/one`, middleware);
                break;
            case 'id':
                //外部路由：ID查询接口
                router.get(`${defaultApiPrefix}/${path}/:id`, middleware);
                break;
            case 'create':
                //外部路由：创建模型接口
                router.post(`${defaultApiPrefix}/${path}`, middleware);
                break;
            case 'update':
                //外部路由：更新模型接口
                router.put(`${defaultApiPrefix}/${path}`, middleware);
                break;
            case 'remove':
                //外部路由：删除模型接口
                router.delete(`${defaultApiPrefix}/${path}`, middleware);
                break;
            default:
                break;
        }
    }
};