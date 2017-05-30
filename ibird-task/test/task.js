'use strict';

/**
 * 测试模块
 * Created by yinfxs on 2017/4/20.
 */

const task = require('../index');
const schedule = require('node-schedule');

// 添加cron表达式类型的任务
task.add({
    name: 'T1',
    spec: '* * * * * *',
    callback: () => {
        console.log('我是cron表达式类型的任务，每秒执行一次');
    }
});

// 添加node-schedule规则类型的任务
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 16;
rule.minute = 58;
rule.second = 10;

task.add([
    {
        name: 'T2',
        spec: rule,
        callback: () => {
            console.log('按rule规则执行');
            task.restart('T1');
        }
    },
    {
        name: 'T3',
        spec: {hour: 16, minute: 57},
        callback: () => {
            console.log('16点57分执行一次');
        }
    }
]);