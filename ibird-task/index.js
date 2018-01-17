'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const utility = require('ibird-utils');
const schedule = require('node-schedule');
const app = { jobs: {}, runnings: {} };

module.exports = app;

/**
 * 添加调度任务
 *
 * @param obj 任务描述对象
 * @param obj.name 任务ID，保证全局唯一
 * @param obj.spec 任务执行规则
 * @param obj.once 任务是否需要立即执行一次
 * @param obj.runMode 任务运行模式，可选值为：S（串行模式）或P（并行模式）；默认为S，即需要等待上一次任务完成后才会触发下一次执行
 * @param obj.callback 任务回调函数
 *
 */
app.add = (obj) => {
    if (obj === null || typeof obj !== 'object') return null;
    if (Array.isArray(obj)) return batchAdd(obj);
    let { name, spec, callback, once, runMode } = obj;
    if (name === null || typeof name !== 'string' || !spec || (typeof callback !== 'function')) return null;
    if (app.jobs[name]) app.jobs[name].cancel();

    runMode = runMode || 'serial';
    runMode = runMode.toLowerCase();
    runMode = ['serial', 'parallel', 's', 'p'].indexOf(runMode) >= 0 ? runMode : 'serial';
    const onTick = callback;
    callback = async () => {
        if (['serial', 's'].indexOf(runMode) >= 0 && app.runnings[name]) return;
        try {
            app.runnings[name] = true;
            await onTick.call(this);
        } finally {
            delete app.runnings[name];
        }
    }

    const job = schedule.scheduleJob(name, spec, callback);

    if (!job) return null;

    Object.assign(job, { spec: spec });
    app.jobs[name] = job;

    if (once) {
        //毫秒数
        const ms = typeof once === 'number' ? once : 1000;
        setTimeout(callback, ms);
    }
    return job;
};

/**
 * 获取任务执行对象
 * @param name 任务ID
 * @returns {*}
 */
app.get = (name) => {
    return app.jobs[name];
};

/**
 * 取消任务
 * @param name 任务ID
 * @returns {*}
 */
app.cancel = (name) => {
    if (!name) return;
    const job = app.jobs[name];
    if (!job) return;
    //取消任务
    job.cancel();
    //从jobs缓存中移除
    const _jobs = {};
    for (let _name in app.jobs) {
        if (_name === name) continue;
        _jobs[_name] = app.jobs[_name];
    }
    app.jobs = _jobs;
};

/**
 * 重启任务
 * @param name 任务ID
 * @param [spec] 新的规则，可选
 * @returns {*}
 */
app.restart = (name, spec) => {
    if (!name) return;
    const job = app.jobs[name];
    if (!job) return;
    job.spec = spec || job.spec;
    job.reschedule(job.spec);
    app.jobs[job.name] = job;
};

/**
 * 批量添加
 * @param array 任务数组
 */
function batchAdd(array) {
    if (array === null || !Array.isArray(array) || array.length == 0) return null;
    const result = {};
    for (let obj of array) {
        if (obj === null || typeof obj !== 'object' || !obj.name) continue;
        result[obj.name] = app.add(obj);
    }
    return result;
}

/**
 * 挂载任务文件夹
 * 将会递归挂载该文件夹下的所有文件
 * @param dir
 */
app.addDir = (dir) => {
    utility.recursiveDir(dir, app.add);
};