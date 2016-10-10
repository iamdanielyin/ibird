/**
 * 任务调度服务
 * Created by yinfxs on 16-10-10.
 */

'use strict';

const _ = require('underscore');
const uuid = require('node-uuid');
const i18n = require('../utils/i18n');
const schedule = require('node-schedule');
const app = {};
const jobs = {};//{name:{job:xxx,data:{}}}

exports = module.exports = app;

/**
 * 初始化全局配置的任务
 * @param tasks
 */
app.init = function (tasks = {}) {
    _.keys(tasks).forEach(function (spec) {
        const value = _.isFunction(tasks[spec]) ? [tasks[spec]] : tasks[spec];
        if (spec == 'custom' || !spec || !_.isArray(value) || value.length == 0) return;
        let pre = null, method = null, post = null;
        switch (value.length) {
            case 1:
                method = value[0];
                break;
            case 2:
                pre = value[0];
                method = value[1];
                break;
            case 3:
                pre = value[0];
                method = value[1];
                post = value[2];
                break;
        }
        if (!_.isFunction(method)) return;
        //开始构建任务
        // const name = uuid.v1();
        // jobs[name] = {
        //     job: null,
        //     data: {}
        // };

        if (_.isFunction(pre)) {
            pre({}, function (data) {
                app.set({
                    name: uuid.v1(),
                    spec: spec,
                    method: function () {
                        method(data);
                    }
                });
                if (_.isFunction(post)) post(data);
            });
        } else {
            app.set({name: name, spec: spec, method: method});
            if (_.isFunction(post)) post(data);
        }
    });
    const custom = tasks['custom'] || [];
    custom.forEach(function (item) {
        let pre = item.pre;
        let post = item.post;
        let method = item.method;
        if (_.isFunction(pre)) {
            pre({}, function (data) {
                console.log(data);
                item.method = () => method(data);
                app.set(item);
                if (_.isFunction(post)) post(data);
            });
        } else {
            item.data = {};
            item.method = () => method(item.data);
            app.set(item);
            if (_.isFunction(post)) post(item.data);
        }
    });
};

/**
 * 获取任务对象
 * @param name
 * @returns {*}
 */
app.get = function (name) {
    return jobs[name];
};

/**
 * 创建任务对象
 * @param item
 */
app.set = function (item) {
    if (!item) return;

    const name = item.name || uuid.v1();
    const spec = item.spec;
    const method = item.method;
    const callback = item.callback;
    const data = item.data || {};

    if (!spec || !_.isFunction(method)) return;
    if (jobs[name] && jobs[name].job) jobs[name].job.cancel();

    const job = schedule.scheduleJob(name, spec, method, callback);
    if (!job) return;
    jobs[name] = {
        data: data,
        job: job
    };
    return item;
};