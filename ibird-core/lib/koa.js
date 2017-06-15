'use strict';


/**
 * Koa基础配置模块
 * Created by yinfxs on 2017/4/5.
 */


const path = require('path');
const fs = require('fs-extra');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('kcors');
const serve = require('koa-static');
const mount = require('koa-mount');
const config = require('./config');
const route = require('./route');
const utility = require('ibird-utils');
const logger = require('./log')();

module.exports = exports;

/**
 * 启动应用
 * @returns {Promise.<void>}
 */
exports.run = async () => {
    const app = new Koa();
    const router = new Router();
    config.router = router;

    config.trigger.emit('ibird_app_all_before', app, router, config);
    //是否支持文件上传
    config.multipart = (typeof config.multipart === 'boolean') ? config.multipart : false;
    const bodyOpts = Object.assign(config.bodyOpts || {}, { strict: false });
    if (config.multipart) {
        config.uploadPath = config.uploadPath || path.resolve(process.cwd(), 'public/uplaod');
        fs.ensureDirSync(config.uploadPath);

        Object.assign(bodyOpts, {
            multipart: true,
            formidable: Object.assign({
                keepExtensions: true,
                uploadDir: config.uploadPath,
                hash: 'sha1'
            }, config.formidable || {})
        });
    }
    app.use(koaBody(bodyOpts));

    //是否存在需要挂载的静态路径
    if (typeof config.static === 'object') {
        config.trigger.emit('ibird_app_static_before', app, router, config);
        for (const key in config.static) {
            if (!key || !key.startsWith('/')) continue;
            const value = config.static[key];
            if (!value) continue;
            fs.ensureDirSync(value);
            app.use(mount(key, serve(value)));
        }
        config.trigger.emit('ibird_app_static_success', app, router, config);
    }

    //检测是否存在跨域配置
    if (config.cross) {
        const cors_options = (typeof config.cross === 'object') ? config.cross : {};
        app.use(cors(cors_options));
    }

    //挂载注入的中间件
    if (Array.isArray(config.middleware) && config.middleware.length > 0) {
        config.trigger.emit('ibird_app_middleware_before', app, router, config);
        for (const item of config.middleware) {
            if (!item || typeof item !== 'function') continue;
            item(app);
        }
        config.trigger.emit('ibird_app_middleware_success', app, router, config);
    }

    //设置接口前缀
    if (config.prefix) router.prefix(config.prefix);

    //路由挂载：1.挂载模型默认路由部分
    if ((typeof config.schema === 'object') && Object.keys(config.schema).length > 0) {
        config.trigger.emit('ibird_route_model_before', app, router, config);
        for (const name in config.schema) {
            const item = config.schema[name];
            if (typeof name !== 'string' || typeof item !== 'object') continue;
            config.trigger.emit(`ibird_route_model_${name}_before`, name, app, router, config);
            route.model(router, item);
            config.trigger.emit(`ibird_route_model_${name}_success`, name, app, router, config);
        }
        config.trigger.emit('ibird_route_model_success', app, router, config);
    }

    //路由挂载：2.挂载自定义路由部分
    if (Array.isArray(config.route) && config.route.length > 0) {
        config.trigger.emit('ibird_route_mount_before', app, router, config);
        for (const item of config.route) {
            if (!item || typeof item !== 'function') continue;
            item(router);
        }
        config.trigger.emit('ibird_route_mount_success', app, router, config);
    }

    //初始化应用监听端口
    config.port = (typeof config.port === 'number' ) && !Number.isNaN(config.port) ? config.port : 3000;
    app.use(router.routes()).use(router.allowedMethods());
    if (config.port) app.listen(config.port);
    config.trigger.emit('ibird_app_start_success', app);
    exports.app = app;
    return app;
};