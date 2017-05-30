# 日志模块

> 模块代码：ibird-log

ibird的核心模块中并不包含任何日志模块，默认日志内容输出是采用console，如果你需要用到日志，那么需要额外引用该模块。

[bunyan](https://github.com/trentm/node-bunyan.git)是一个简单而快速的JSON日志记录模块，ibird-log使用[bunyan](https://github.com/trentm/node-bunyan.git)作为内部的日志处理器，你可以完全按照bunyan的配置来初始化你的日志对象。

## 初始化日志对象

首先你需要按自己的实际需要确定好配置，并使用配置初始化日志对象：

```js
// 引用日志模块
const log = require('ibird-log');
// 初始化日志实例
const logger = log.config({
    name: 'ibird-app',
    hostname: 'www.example.com'
});
// 使用日志对象记录日志
logger.warn('我是警告日志');
logger.info('我是普通日志');
logger.error('我是异常日志');
```

> Tips：日志对象只需要初始化一次即可，初始化成功后可通过log.logger来获取日志对象。

## 默认配置

日志模块的默认配置信息如下所示，详细的配置项[bunyan](https://github.com/trentm/node-bunyan.git)已经描述得很清楚，这里不再赘述，有需要的请移步[bunyan](https://github.com/trentm/node-bunyan.git)：

```js
// 日志模块默认配置
const config = {
    name: 'ibird', // 日志标记，一般为应用名称，会在记录日志时使用
    streams: [ // 日志处理流
        {
            level: 'info', // 默认日志级别
            stream: process.stdout // 输出到控制台
        },
        {
            type: 'rotating-file', // 循环文件流，循环指定周期记录日志
            level: 'error', // 错误级别
            path: path.join(process.cwd(), `logs/${obj.name || 'ibird' }-error.log`), // 日志存放路径
            period: '1d', // 按每天作为日志循环周期
            count: 3 // 保存3个周期备份文件，即3天
        },
        {
            type: 'rotating-file',
            level: 'info',
            path: path.join(process.cwd(), `logs/${obj.name || 'ibird' }.log`),
            period: '1d',
            count: 3
        }
    ]
};
```

## 在ibird中的使用

首先你需要将初始化成功的实例注册到ibird的配置项中，然后ibird在运行时就会自动使用该日志实例来记录日志了，配置方式如下所示：

```js
// 引用ibird核心模块
const app = require('ibird-core');
// 引用日志模块
const log = require('ibird-log');
// 初始化日志实例
const logger = log.config({name: 'ibird-app', hostname: 'www.example.com'});
// 注册实例到ibird配置项中
app.config('logger', logger); 

// 使用日志对象记录日志
logger.warn('我是警告日志');
logger.info('我是普通日志');
logger.error('我是异常日志');
```

> Tips：日志对象只需要注册一次，注册成功后可通过app.logger来获取日志对象。

## 在非ibird环境中使用

ibird-log不单单是可以在bird中使用，你也完全可以在自己的应用中使用：

```js
const log = require('ibird-log');
const logger = log.config({name: 'my-app', hostname: 'www.example.com'});

// 使用日志对象记录日志
logger.warn('我是警告日志');
logger.info('我是普通日志');
logger.error('我是异常日志');
```



