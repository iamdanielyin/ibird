/**
 * 应用声明模块
 */

const debug = require('debug')('ibird:application');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('kcors');
const serve = require('koa-static');
const mount = require('koa-mount');
const fsx = require('fs-extra');
const utility = require('ibird-utils');
const Mustache = require('mustache');
const context = require('./context');

/**
 * 应用类
 */
class App extends Koa {
    /**
     * 初始化一个新应用
     * @param opts
     */
    constructor(opts) {
        super();
        this._koaUse = super.use;
        opts = opts || {};
        opts.name = opts.name || 'ibird';
        opts = Object.assign({
            port: 3000,
            bodyOpts: { strict: false }
        }, opts);
        this._addons = this._addons || {};
        this.config(opts);
    }

    /**
     * 应用配置
     * @param opts
     * @returns {App}
     */
    config(opts) {
        debug('config');

        // Event - ibird:app:config:pre
        this.emit('ibird:app:config:pre', this, opts);

        if (opts) {
            if (!this._config) {
                // 初始化
                opts = initialize.call(this, opts);
            }
            // 合并配置
            this._config = Object.assign((this._config || {}), opts);

            // 触发插件 onConfig
            loopAddons.call(this, (addon) => {
                if (typeof addon.onConfig === 'function') {
                    addon.onConfig(fn);
                }
            });

            // 挂载中间件目录
            if (typeof opts.middlewareDir === 'string') {
                this.useDir(opts.middlewareDir);
            }

            // 挂载路由目录
            if (typeof opts.routesDir === 'string') {
                this.mountDir(opts.routesDir);
            }
        }

        // Event - ibird:app:config:post
        this.emit('ibird:app:config:post', this);

        return this._config;
    }

    c() {
        return this._config;
    }

    use(fn) {
        debug('use');

        // Event - ibird:app:use
        this.emit('ibird:app:use', this, fn);

        this._koaUse(fn);

        // 触发插件 onUse
        loopAddons.call(this, (addon) => {
            if (typeof addon.onUse === 'function') {
                addon.onUse(fn);
            }
        });
        return this;
    }

    /**
     * 自动挂载中间件目录
     * @param dir 文件目录
     * @returns {App}
     */
    useDir(dir) {
        // Event - ibird:app:useDir
        this.emit('ibird:app:useDir', this, dir);

        utility.recursiveDir(dir, this.use.bind(this));
        return this;
    }

    /**
     * 挂载路由
     * @param fn 路由函数
     * @returns {App}
     */
    mount(fn) {
        debug('mount');

        // Event - ibird:app:mount
        this.emit('ibird:app:mount', this, fn);

        if (typeof fn === 'function') {
            fn(this.router);
        } else if (typeof fn === 'object') {
            if (fn.path && typeof fn.middleware === 'function') {
                fn.name = fn.name || fn.path;
                fn.method = fn.method || 'GET';
                this.router.register(fn.path, [fn.method], fn.middleware, {
                    name: fn.name
                });
            }
        }
        // 触发插件 onMount
        loopAddons.call(this, (addon) => {
            if (typeof addon.onMount === 'function') {
                addon.onMount(fn);
            }
        });
        return this;
    }

    /**
     * 自动挂载路由组目录
     * @param dir 文件目录
     * @returns {App}
     */
    mountDir(dir) {
        // Event - ibird:app:mountDir
        this.emit('ibird:app:mountDir', this, dir);

        utility.recursiveDir(dir, this.mount.bind(this));
        return this;
    }

    /**
     * 引用插件
     * @param addon
     * @param options
     */
    import(addon, options) {
        debug('import');

        // 处理批量引用插件
        if (Array.isArray(addon) && addon.length > 0) {
            for (const item of addon) {
                if (Array.isArray(item) && item.length > 0) {
                    this.import.call(this, item[0], (item.length > 1 ? item[1] : null));
                } else {
                    if (item.addon) {
                        this.import.call(this, item.addon, item.options);
                    } else {
                        this.import.call(this, item);
                    }
                }
            }
            return;
        }

        if (!addon || !addon.namespace) throw new Error(`'namespace' must be provided`);
        options = Object.assign({ autoMountRoutes: true, autoUseMiddleware: true, apiAlias: {} }, options);

        // Event - ibird:app:import:pre
        this.emit('ibird:app:import:pre', this, addon, options);

        // 加载插件国际化配置
        if (addon.locales && Object.keys(addon.locales).length > 0) {
            utility.assign(this.locales, addon.locales);
        }

        // 触发加载函数
        if (typeof addon.onload === 'function') {
            addon.onload(this, options);
        }

        // 自动挂载中间件
        if (options.autoUseMiddleware && addon.middleware && Object.keys(addon.middleware).length > 0) {
            for (const key in addon.middleware) {
                const value = addon.middleware[key];
                if (typeof value !== 'function') continue;
                this.use(value);
            }
        }

        // 自动挂载路由
        if (options.autoMountRoutes && addon.routes && Object.keys(addon.routes).length > 0) {
            for (const key in addon.routes) {
                const value = addon.routes[key];
                this.mount(value);
            }
        }

        // 挂载addon扩展的api
        if (addon.api) {
            const api = addon.api;
            for (let key in api) {
                const value = api[key];
                // 处理别名
                if (options.apiAlias && options.apiAlias[key]) {
                    key = options.apiAlias[key];
                }
                this[key] = (typeof value === 'function') ? value.bind(this) : value;
            }
        }
        this._addons[addon.namespace] = addon;

        // Event - ibird:app:import:post
        this.emit('ibird:app:import:post', this, addon, options);

        return this;
    }

    /**
     * 启动应用
     * @param [port] 启动端口
     * @param [callback] 回调函数
     * @returns {App}
     */
    play(port, callback) {
        debug('play');

        // Event - ibird:app:play:pre
        this.emit('ibird:app:play:pre', this, port, callback);

        // 触发插件 onplay
        loopAddons.call(this, (addon) => {
            if (typeof addon.onplay === 'function') {
                addon.onplay(this);
            }
        });
        // 挂载路由声明
        this.use(this.router.routes()).use(this.router.allowedMethods());
        if (port === null || (typeof port === 'number' && Number.isFinite(port) && !Number.isNaN(port))) {
            this._config.port = port;
        } else if (typeof port === 'function') {
            callback = port;
            port = this._config.port;
        } else {
            port = this._config.port;
        }

        // 启动应用
        if (port) {
            callback = callback || (() => console.log(`Listen and serve on 0.0.0.0:${port}`));
            this.listen(port, callback);

            // Event - ibird:app:listen
            this.emit('ibird:app:listen', this);
        }

        // Event - ibird:app:play:post
        this.emit('ibird:app:play:post', this, port, callback);
        return this;
    }
}

/**
 * 挂载默认日志API
 */
function defaultLogsAPIs() {
    ['error', 'warn', 'info', 'verbose', 'debug', 'silly'].forEach(level => {
        if (typeof this[level] === 'function') return;
        if (level === 'error') {
            this[level] = (msg) => {
                console.error(msg);
            }
        } else {
            this[level] = (msg) => {
                console.log(msg);
            }
        }
    });
}

/**
 * 挂载默认日志API
 */
function defaultLocaleAPIs() {
    if (typeof this.locales !== 'object') {
        this.locales = {};
    }
    if (typeof this.getLocaleString === 'function') return;
    const defaultLocale = this.c().defaultLocale || 'en_US';

    this.getLocaleString = (key, params, localeOrName) => {
        let locale = (typeof localeOrName === 'string') ? this.locales[localeOrName] : null;
        if (!locale || Object.keys(locale).length === 0) {
            localeOrName = defaultLocale;
            locale = this.locales[localeOrName]
        }
        if (!locale || Object.keys(locale).length === 0) {
            throw new Error('Invalid i18n settings.');
        }
        const value = locale[key];
        if (!key || !value) return null;
        return Mustache.render(value, params);
    };
}

/**
 * 加载插件国际化设置
 */
function loadAddonLocales() {
    ['error', 'warn', 'info', 'verbose', 'debug', 'silly'].forEach(level => {
        if (typeof this[level] === 'function') return;
        if (level === 'error') {
            this[level] = (msg) => {
                console.error(msg);
            }
        } else {
            this[level] = (msg) => {
                console.log(msg);
            }
        }
    });
}

/**
 * 循环插件列表
 * @param callback 回调函数
 */
function loopAddons(callback) {
    if ((typeof callback !== 'function') || (!this._addons || Object.keys(this._addons).length === 0)) return;
    for (const namespace in this._addons) {
        const addon = this._addons[namespace];
        callback(addon);
    }
}

/**
 * 初始化应用
 * @param opts 应用配置
 */
function initialize(opts) {
    // Event - ibird:app:initialize:pre
    this.emit('ibird:app:initialize:pre', this, opts);

    if (opts.uploadDir) {
        opts.bodyOpts = opts.bodyOpts || {};
        opts.bodyOpts.multipart = true;

        opts.bodyOpts.formidable = Object.assign({
            keepExtensions: true,
            uploadDir: opts.uploadDir,
            hash: 'sha1'
        }, opts.bodyOpts.formidable || {});
        fsx.ensureDirSync(opts.uploadDir);
    }
    // 挂载body中间件
    this.use(koaBody(opts.bodyOpts));
    // 挂载静态资源目录
    if (opts.statics) {
        for (const key in opts.statics) {
            if (!key || !key.startsWith('/')) continue;
            const value = opts.statics[key];
            if (!value) continue;
            fsx.ensureDirSync(value);
            this.use(mount(key, serve(value)));
        }
    }

    //检测是否存在跨域配置
    if (opts.cross) {
        const corsOpts = (typeof opts.cross === 'object') ? opts.cross : {};
        this.use(cors(corsOpts));
    }
    this.router = new Router();

    // 设置接口前缀
    if (opts.prefix) {
        this.router.prefix(opts.prefix);
    }

    // 挂载常用路由函数
    const methods = [
        'head',
        'options',
        'get',
        'put',
        'patch',
        'post',
        'delete'
    ];
    methods.forEach(m => (this[m] = this.router[m].bind(this.router)));

    // 缓存到全局上下文对象中
    context(opts.name, this);

    // Event - ibird:app:initialize:post
    this.emit('ibird:app:initialize:post', this, opts);

    // 挂载默认API
    defaultLogsAPIs.call(this);
    defaultLocaleAPIs.call(this);

    return opts;
}

/**
 * 导出应用声明
 * @type {App}
 */
module.exports = App;
