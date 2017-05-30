# 调度任务

> 模块代码：ibird-task

本模块是对[node-schedule](https://github.com/node-schedule/node-schedule)的轻度封装，提供简单统一的接口来操作任务。

## 安装模块

```bash
npm i ibird-task -D
```

## 接口列表

以下是本模块开放的所有接口：

* add：添加任务，可直接添加单个任务或多个任务
* get：获取执行中的任务对象
* cancel：取消正在执行的任务
* restart：重启正在执行的任务

### 任务结构

任务对象具有固定的结构，每次添加任务时，必须按该结构正确指定相关参数：

* name：任务ID，字符串，需保证全局唯一
* spec：任务执行规则，可传递cron字符串或者[node-schedule](https://github.com/node-schedule/node-schedule)的规则对象
* callback：任务执行函数，为函数类型，表示每次任务执行时所做的操作

具体示例如下所示：

```js
const obj = {
    name: 'T1',
    spec: '* * * * * *',
    callback: () => {
        console.log('我是cron表达式类型的任务，每秒执行一次');
    }
};
```

### 添加任务

> 调用方式：task.add

以下是添加接口的调用示例：

```js
const task = require('nod');
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
```

### 获取任务对象

> 调用方式：task.get

开发者可以通过该接口获取已运行任务的job对象，调用方式如下所示：

```js
const job = task.get('T1');
```

返回的job即为node-schedule的任务执行对象，当返回null或undefined时表示任务未运行。

### 取消任务

> 调用方式：task.cancel

当任务正常运行时，可传递任务name来立即取消任务：

```js
task.cancel('T1');
```

### 重启任务

> 调用方式：task.restart

可以调用该接口重启任务，该接口接收两个参数，任务ID（name）和任务规则（spec，可选），其中任务规则非必填，如果为空，任务将以原规则重启，具体方式如下所示：

```js
// 以原规则重启任务
task.restart('T1');
// 以新的cron表达式规则重启任务
task.restart('T1', '10 * * * * *');
// 以自定义规则重启任务
task.restart('T1', {hour: 16, minute: 57});
```



