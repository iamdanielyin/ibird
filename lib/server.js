/**
 * ibird
 * Created by yinfxs on 16-5-30.
 */

'use strict';

const _ = require('lodash');
const assign = require('object-assign');
const path = require('path');
const fs = require('fs');
const express = require('express');
const moment = require('moment');
moment.locale('zh-cn');
const multipart = require('connect-multiparty');

const app = require('./express');
const model = require('./model/mongodb');
const modelRoute = require('./route/adapter');
const moduleRoute = require('./route/module');
const Redis = require('./utils/db/redis');
const utility = require('./utils/utility');
const i18n = require('./utils/i18n');
const log = require('./utils/log');
const docs = require('./utils/docs');
const tasks = require('./utils/tasks');

exports.app = app;
exports.token = require('./token/adapter');
exports.tokenmdl = require('./middleware/tokenmdl');
exports.uploadmdl = require('./middleware/uploadmdl');
exports.configs = {};
exports.redis = {};
exports.models = {};//模型搜集器
exports.log = log;
exports.hooks = {};
exports.hooksdata = {};
exports.tasks = tasks;

//导入预置模块
const preset = require('./modules/preset');

const logger = log(module);

/**
 * 初始化配置
 *
 * @returns {string}
 */
exports.initialize = function (configs) {
    //设置默认值
    configs = setDefaultConfigs(configs);
    model.schemaDefaults(configs.modules);
    //国际化设置
    configs.i18n = i18n(configs.i18n);
    if (configsValidate(configs)) return exports;
    //导出配置
    exports.configs = configs;
    //初始化
    log(module, configs.config.logpath || path.resolve(process.cwd(), "logs"));
    exports.redis = Redis(configs.config.redis);//Redis连接初始化
    exports.token.initialize((configs.config.redis ? 'redis' : ds), configs.config.token);//授权初始化
    docs(configs, configs.config.ruprefix);//文档初始化
    //挂载自定义express中间件
    if (configs.middlewares) configs.middlewares(app);
    //设置public目录，用于存储上传文件
    app.use('/public', express.static(configs.public));
    exports.uploadmdl = exports.uploadmdl(configs.public);//初始化上传中间件
    //如果存在客户端目录的话，挂载客户端目录
    if (configs.config.clients) {
        const clients = configs.config.clients;
        _.keys(clients).forEach((key) => {
            if (!key || !clients[key]) return;
            app.use(key, express.static(clients[key]));
        });
    }
    //跨域调用
    if (exports.configs.config['cross-domain']) {
        app.use(function (req, res, next) {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Credentials', 'true');
            res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
            res.set('Access-Control-Allow-Headers', 'Content-Type,Accept,access_token');
            next();
        });
    }
    //提取模块配置部分
    const modules = configs.modules;
    const hooks = exports.hooks = configs.hooks, hooksdata = exports.hooksdata = {};
    //注册数据模型
    utility.execHooks(hooks, 'pre-model', app, configs, hooksdata);
    model.init(configs.config.mongodb, modules, exports.models, () => {
        utility.execHooks(hooks, 'post-model', app, configs, hooksdata);
    });
    //注册模块声明路由，顺序先于模型路由是为了允许用户自定义重写默认的模型路由
    utility.execHooks(hooks, 'pre-module-route', app, configs, hooksdata);
    moduleRoute(app, modules, configs.config.ruprefix, function () {
        utility.execHooks(hooks, 'post-module-route', app, configs, hooksdata);
    });
    //注册模型默认路由
    utility.execHooks(hooks, 'pre-model-route', app, configs, hooksdata);
    modelRoute(app, modules, exports.models, configs.config.ruprefix, exports.uploadmdl, function () {
        utility.execHooks(hooks, 'post-model-route', app, configs, hooksdata);
    });
    defaultTasks(configs);
    //加载框架默认路由
    defaultRoutes(configs.config.ruprefix);
    //加载调度任务
    tasks.init(configs.tasks);
    //返回导出对象
    return exports;
};

/**
 * 设置默认配置
 * @param configs
 * @returns {*}
 */
function setDefaultConfigs(configs) {
    configs = preModules(configs);//设置默认模块
    configs.menu = configs.menu || defaultMenus(configs.modules);//设置默认菜单
    configs.name = configs.name || '${name}';
    configs.admins = (configs.admins || ['ibird', 'admin', 'root']).concat(['ibird']);
    configs.admins = _.uniq(configs.admins);
    configs.public = configs.public || path.resolve(process.cwd(), "public");
    configs.config.ruprefix = configs.config.ruprefix || '/api';
    configs.i18n = configs.i18n || {
            selected: 'zh',
            sources: {
                'en': require('./i18n/en.i18n')
            }
        };
    return configs;
}
/**
 * 模块预处理
 * @param configs
 * @returns {*}
 */
function preModules(configs) {
    const modules = {};
    configs.modules.forEach(function (mdl) {
        modules[mdl.code] = mdl;
    });
    modules.preset = modules.preset || {};
    assign(modules.preset, preset(exports));
    configs.modules = _.values(modules);
    configs.modules = configs.modules.reverse();
    return configs;
}

/**
 * 生成默认菜单
 * @param modules
 * @returns {Array}
 */
function defaultMenus(modules) {
    const menus = [];
    if (!modules || modules.length == 0) return menus;
    modules.forEach(function (mdl, i) {
        if (!mdl || !mdl.code || !mdl.label) return;
        const object = {
            code: mdl.code,
            label: mdl.label,
            icon: mdl.icon || "circle",
            items: []
        };
        (mdl.schemas || []).forEach((schema, j) => {
            if (!schema || !schema.code || !schema.label) return;
            object.items.push({
                code: schema.code,
                label: schema.label,
                icon: schema.icon || 'circle-o',
                uri: `\/${mdl.code}\/${schema.code}`,
                authid: `${mdl.code}_${schema.code}_menu`
            });
        });
        menus.push(object);
    });
    return menus;
}

/**
 * 配置验证
 */
function configsValidate(configs) {
    if (!configs.public) return logger.info(i18n.value('configs_public'));
}
/**
 * 系统默认任务
 */
function defaultTasks(configs) {
    defaultTasksUserOrg(configs);
    defaultTasksResources(configs);
}

/**
 * 检查是否存在默认的用户和机构
 * @param config
 */
function defaultTasksUserOrg(config) {
    if (!exports.models || !exports.models['preset-user'] || !exports.models['preset-org']) return;
    const User = exports.models['preset-user'].value;
    const Org = exports.models['preset-org'].value;
    if (!User || !Org) return;

    const parent = {
        org: '1',
        creater: 'ibird',
        modifier: 'ibird',
        dr: 0
    };

    const adduser = () => {
        User.create(assign({}, parent, {
            _id: 'ibird',
            code: 'ibird',
            name: '超级管理员',
            password: 'ibird123',
            org: '1',
            roles: ['SUPER']
        }), (err, result) => {
            if (err) return logger.error(`创建默认超级管理员异常：${err.message}`);
            logger.info(`创建默认超级管理员成功：${result.code}`);
        });
    };
    const addorg = () => {
        Org.create(assign({}, parent, {
            _id: '1',
            code: '1',
            name: '最高机构'
        }), (err, result) => {
            if (err) return logger.error(`创建默认最高机构成功异常：${err.message}`);
            logger.info(`创建默认最高机构成功：${result.code}`);
        });
    };
    Org.findOne({code: '1'}, (err, result) => {
        if (err) return logger.error(`查询最高机构异常：${err.message}`);
        if (result && result._id) return;
        addorg();
    });
    User.findOne({code: 'ibird'}, (err, result) => {
        if (err) return logger.error(`查询超级管理员异常：${err.message}`);
        if (result && result._id) return;
        adduser();
    });
}

/**
 * 维护所有模型系统资源列表
 * @param configs
 */
function defaultTasksResources(configs) {
    if (!configs || !_.isArray(configs.modules) || configs.modules.length == 0) return;
    if (!exports.models || !exports.models['preset-resource']) return;
    const modules = configs.modules;
    const resources = [];
    const parent = {
        org: '',
        creater: 'ibird',
        modifier: 'ibird',
        dr: 0,
        type: '1'
    };
    modules.forEach(function (mdl) {
        if (!mdl || !mdl.code || !mdl.label) return;
        (mdl.schemas || []).forEach(function (schema) {
            if (!schema || !schema.code || !schema.label) return;
            const codePrefix = `${mdl.code}:${schema.code}`;
            const namePrefix = `${mdl.label}:${schema.label}`;
            parent.tag = `${mdl.label + ' ' + schema.label}`;
            //接口权限
            resources.push(assign({}, parent, {
                name: `${namePrefix}(接口新增权限)`,
                code: `${codePrefix}:create:service`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(接口修改权限)`,
                code: `${codePrefix}:update:service`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(接口删除权限)`,
                code: `${codePrefix}:delete:service`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(接口列表查询权限)`,
                code: `${codePrefix}:list:service`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(接口详情查询权限)`,
                code: `${codePrefix}:one:service`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(接口导入权限)`,
                code: `${codePrefix}:import:service`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(接口导出权限)`,
                code: `${codePrefix}:export:service`
            }));
            //界面权限
            resources.push(assign({}, parent, {
                name: `${namePrefix}(列表搜索权限)`,
                code: `${codePrefix}:list:ui:search`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(列表查看权限)`,
                code: `${codePrefix}:list:ui:view`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(列表导入权限)`,
                code: `${codePrefix}:list:ui:toolbar:import`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(列表导出权限)`,
                code: `${codePrefix}:list:ui:toolbar:export`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(列表批量删除权限)`,
                code: `${codePrefix}:list:ui:toolbar:delete`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(列表单个删除权限)`,
                code: `${codePrefix}:list:ui:colact:delete`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(表单查看权限)`,
                code: `${codePrefix}:form:view`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(表单新增权限)`,
                code: `${codePrefix}:form:add`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(表单修改权限)`,
                code: `${codePrefix}:form:edit`
            }));
            resources.push(assign({}, parent, {
                name: `${namePrefix}(菜单访问权限)`,
                code: `${codePrefix}:menu`
            }));
            //字段权限
            if (schema.partsauth != true) return;
            parent.tag = `${mdl.label + ' ' + schema.label + '(字段权限)'}`;
            _.keys(schema.fields).forEach((key) => {
                const field = schema.fields[key];
                resources.push(assign({}, parent, {
                    name: `${namePrefix}(<${field.label || key}>字段列表页可读权限)`,
                    code: `${codePrefix}:fields:${key}:read:table`
                }));
                resources.push(assign({}, parent, {
                    name: `${namePrefix}(<${field.label || key}>字段表单页可读权限)`,
                    code: `${codePrefix}:fields:${key}:read:form`
                }));
                resources.push(assign({}, parent, {
                    name: `${namePrefix}(<${field.label || key}>字段可写权限)`,
                    code: `${codePrefix}:fields:${key}:write`
                }));
            });
        });
    });
    const superole = {
        _id: 'SUPER',
        code: 'SUPER',
        name: '超级管理员',
        scope: '3',
        resources: [],
        org: '1',
        creater: 'ibird',
        modifier: 'ibird',
        dr: 0
    };
    resources.forEach((item) => {
        item._id = item.code.replace(/:/g, '_');
        superole.resources.push(item._id);
    });
    const Resource = exports.models['preset-resource'].value;
    const Role = exports.models['preset-role'].value;
    Resource.remove({type: '1'}, (err, result) => {
        if (err) return logger.error(`维护系统资源异常：${err.message}`);
        Resource.create(resources, (err, result) => {
            if (err) return logger.error(`维护系统资源异常：${err.message}`);
            logger.info(`维护系统资源成功`);
        });
    });
    Role.findOne({$or: [{_id: 'SUPER'}, {code: 'SUPER'}]}, (err, result) => {
        if (err) return logger.error(`查询超级管理员角色异常：${err.message}`);
        if (result && result._id) {
            //修改
            if (result.code || result.name || _.isArray(result.resources)) {
                superole.code = result.code || superole.code;
                superole.name = result.name || superole.name;
                superole.resources = _.isArray(result.resources) ? result.resources.concat(superole.resources) : superole.resources;
                superole.resources = _.uniq(superole.resources);
            }
            Role.update({_id: result._id}, _.omit(superole, '_id'), (err, result) => {
                if (err) return logger.error(`维护超级管理员角色异常：${err.message}`);
                logger.info('自动更新超级管理员角色资源列表');
            });
        } else {
            //新增
            superole.resources = _.uniq(superole.resources);
            Role.create(superole, (err, result) => {
                if (err) return logger.error(`维护超级管理员角色异常：${err.message}`);
                logger.info('自动更新超级管理员角色资源列表');
            });
        }
    });
}

/**
 * 获取系统隐私配置部分
 * @returns {*}
 */
function getPrivateConfigs() {
    const i18nConfig = {lang: i18n.selected(), i18n: i18n.object()};
    const result = {};
    const modules = [];
    exports.configs.modules.forEach(function (module) {
        if (!module) return;
        modules.push(utility.pick(module, ['code', 'label', 'schemas']))
    });
    assign(result, i18nConfig, {modules: modules}, utility.pick(exports.configs, ['name', 'version', 'menu']));
    const json = i18n.format(utility.deepClone(result));
    return json;
}

/**
 * 获取系统公共配置部分
 * @param result
 * @param i18nConfig
 * @returns {*}
 */
function getPublicConfigs() {
    const i18nConfig = {lang: i18n.selected(), i18n: i18n.object()};
    const result = {};
    assign(result, i18nConfig, utility.pick(exports.configs, ['name', 'version']));
    const json = i18n.format(utility.deepClone(result));
    return json;
}

/**
 * 获取系统配置部分
 * @param flag
 * @returns {*}
 */
exports._configs = (flag) => {
    if (!flag || ['PUBLIC', 'PRIVATE'].indexOf(flag.trim().toUpperCase()) == -1) return {};
    switch (flag) {
        case 'PRIVATE':
            return getPrivateConfigs();
            break;
        case 'PUBLIC':
            return getPublicConfigs();
            break;
    }
};
/**
 * 服务端默认路由设置
 */
function defaultRoutes(ruprefix = '') {
    app.get('/', function (req, res) {
        res.end('Hello ibird-server!');
    });

    app.post(ruprefix + '/i18n', function (req, res) {
        const lang = req.query.lang || req.body.lang;
        const result = i18n.set(lang);
        if (result == false) return res.json({err: {message: i18n.value('invalid_i18n_setting')}});
        return res.json({lang: lang, i18n: result});
    });

    app.get(ruprefix + '/configs', function (req, res) {
        const flag = req.query.flag || 'public';
        const access_token = req.query.access_token;
        const i18nConfig = {lang: i18n.selected(), i18n: i18n.object()};
        const result = {};
        switch (flag) {
            case 'public':
                const json = getPublicConfigs();
                return res.json(json);
            case 'private':
                exports.token.authentication(access_token, function (err, r) {
                    if (err || !r) return res.json({err: {message: i18n.value('unauthorized_operation')}});
                    const json = getPrivateConfigs();
                    return res.json(json);
                });
                break;
        }
    });
    app.get(ruprefix + '/home', function (req, res) {
        const access_token = req.query.access_token;
        exports.token.authentication(access_token, function (err, r) {
            if (err || !r) return res.json({err: {message: i18n.value('unauthorized_operation')}});
            const data = [];
            const models = exports.models;
            let size = 0;
            _.keys(models).forEach(function (key) {
                const model = models[key] || {};
                const Value = model.value;
                const type = model.type;
                const schema = model.schema || {};
                if (!schema.label) return;
                size++;
                function callback() {
                    if (data.length < size) return;
                    return res.json(data);
                }

                Value.count({}, function (err, count) {
                    if (err) {
                        --size;
                        return callback();
                    }
                    data.push({
                        icon: schema.icon || 'files-o',
                        label: schema.label,
                        code: key,
                        uri: `\/${model.mdlcode}\/${schema.code}`,
                        total: count
                    });
                    callback();
                });
            });
        });
    });

    app.post(ruprefix + '/upload', exports.uploadmdl, function (req, res) {
        let files = req.files ? req.files.files : [];
        const source = req.query.image_source || req.body.image_source;
        if (!_.isArray(files)) files = [files];
        const resultArray = [];
        files.forEach(function (file) {
            if (!file) return;
            const filePath = file.path;
            resultArray.push('/public/' + filePath.substring(file.path.lastIndexOf('/') + 1));
        });
        return source == 'editor' ? res.end(resultArray.length > 0 ? resultArray[0] : 'err|服务器端错误') : res.json(resultArray);
    });
}

/**
 * 路由
 */
exports.start = function () {
    const port = exports.configs.config.port || 3000;
    utility.execHooks(exports.hooks, 'pre-start', app, exports.configs, exports.hooksdata);
    app.listen(port, function () {
        logger.info(i18n.value('ibird_running', [port, 'http://127.0.0.1:' + port]));
        utility.execHooks(exports.hooks, 'post-start', app, exports.configs, exports.hooksdata);
    });
};