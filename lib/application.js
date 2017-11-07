/**
 * 应用声明模块
 */

const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('kcors');
const serve = require('koa-static');
const mount = require('koa-mount');
const fsx = require('fs-extra');
const utility = require('ibird-utils');
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
        }
        return this._config;
    }

    use(fn) {
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
        utility.recursiveDir(dir, this.use.bind(this));
        return this;
    }

    /**
     * 挂载路由
     * @param fn 路由函数
     * @returns {App}
     */
    mount(fn) {
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
        utility.recursiveDir(dir, this.mount.bind(this));
        return this;
    }

    /**
     * 挂载插件
     * @param addon
     * @param options
     */
    import(addon, options) {
        if (!addon || !addon.namespace) throw new Error(`'namespace' must be provided`);
        options = options || { autoMountRoutes: false, autoUseMiddleware: false };
        this._addons[addon.namespace] = addon;
        // 触发加载函数
        if (typeof addon.onLoad === 'function') {
            addon.onLoad(this);
        }

        // 注册自定义事件
        if (add.pub && Object.keys(add.pub).length > 0) {
            for (let key in add.pub) {
                const prefix = `${addon.namespace}:`;
                key = key.startsWith(prefix) ? key : `${prefix}${key}`;
                let value = add.pub[key];
                value = typeof value === 'function' ? value(this) : value;
                this.emit(key, value);
            }
        }
        // 自动挂载中间件
        if (options.autoUseMiddleware && addon.middleware && Object.keys(add.middleware).length > 0) {
            for (const key in addon.middleware) {
                const value = addon.middleware[key];
                if (typeof value !== 'function') continue;
                this.use(value);
            }
        }
        // 自动挂载路由
        if (options.autoMountRoutes && addon.routes && Object.keys(add.routes).length > 0) {
            for (const key in addon.routes) {
                const value = addon.routes[key];
                this.mount(value);
            }
        }
        // 挂载hits
        if (addon.hits) {
            for (const key1 in addon.hits) {
                const key2 = `${addon.namespace}:${key1}`;
                const value = addon.hits[key1];
                if (!this[key1]) {
                    this[key1] = (typeof value === 'function') ? value.bind(this) : value;
                } else if (!this[key2]) {
                    this[key2] = (typeof value === 'function') ? value.bind(this) : value;
                }
            }
        }
    }

    /**
     * 启动应用
     * @param args 启动参数
     * @returns {App}
     */
    play(...args) {
        if (!this._config) {
            this._config = this._config || initialize.call(this);
        }
        this.use(this.router.routes()).use(this.router.allowedMethods());
        args = Array.isArray(args) && args.length > 0 ? args : this._config.port;
        if (args) {
            this.listen(args);
        }
        return this;
    }
}

/**
 * 循环插件列表
 * @param callback 回调函数
 */
function loopAddons(callback) {
    if ((typeof callback !== 'function') || (!this.addons || Object.keys(this.addons).length === 0)) return;
    for (const namespace in this.addons) {
        const addon = this.addons[namespace];
        callback(addon);
    }
}

/**
 * 初始化应用
 * @param opts 应用配置
 */
function initialize(opts) {
    if (opts.multipart) {
        opts.bodyOpts = opts.bodyOpts || {};
        opts.bodyOpts.multipart = true;

        if (!opts.uploadDir) {
            throw new Error(`'uploadDir' must be provided`);
        }

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
        'get',
        'post',
        'put',
        'delete',
        'patch'
    ];
    methods.forEach(m => (this[m] = this.router[m].bind(this.router)));

    // 缓存到全局上下文对象中
    context(opts.name, this);
    return opts;
}

/**
 * 导出应用声明
 * @type {App}
 */
module.exports = App;