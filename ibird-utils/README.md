# 通用工具

> 模块代码：ibird-utils

本模块是一个简单的工具模块，目的是在尽可能不引用第三方模块的前提下，通过Node和JavaScript本身的特性来实现一些常用功能，提供一些在开发过程中的常用工具函数，本模块将持续更新。

## 安装模块

```js
npm i ibird-utils -D
```

## 引用模块

```js
const utility = require('ibird-utils');
```

## 接口列表

* utility.parse：安全转换字符串为JSON格式，不抛出异常
* utility.errors：包装mongoose异常对象
* utility.sortBy：按指定Key对数组内的对象排序
* utility.omit：从对象中移除指定的key
* utility.uniq：确保数组中的元素唯一
* ......



