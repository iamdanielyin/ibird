# 文档介绍

Backbone.js gives structure to web applications by providing models with 
key-value binding and custom events, collections with a rich API of enumerable 
functions, views with declarative event handling, and connects it all to your 
existing API over a RESTful JSON interface.

The project is hosted on GitHub, and the annotated source code is available, as well as an online test suite, an example application, a list of tutorials and a long list of real-world projects that use Backbone. Backbone is available for use under the MIT software license.

You can report bugs and discuss features on the GitHub issues page, on Freenode IRC in the #documentcloud channel, post questions to the Google Group, add pages to the wiki or send tweets to @documentcloud.

Backbone is an open-source component of DocumentCloud.

Here, I try to document the good practices that our team has learned along the
way building [Backbone][bb] applications.

This document assumes that you already have some knowledge of [Backbone.js][bb],
[jQuery][jq], and of course, JavaScript itself.

[rsc]: http://ricostacruz.com/
[bb]: http://documentcloud.github.com/backbone/
[jq]: http://jquery.com/


模块 100
======
接口地址 1001
---------------
接口描述

#### HTTP请求方式
GET
#### 支持格式
JSON
#### 备注
暂无
#### 请求参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 响应参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 调用示例
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```

接口地址 1002
---------
接口描述

#### HTTP请求方式
GET
#### 支持格式
JSON
#### 备注
暂无
#### 请求参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 响应参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 调用示例
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```

模块 200
======
接口地址 2001
---------------
接口描述

#### HTTP请求方式
GET
#### 支持格式
JSON
#### 备注
暂无
#### 请求参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 响应参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 调用示例
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```

接口地址 2002
---------
接口描述

#### HTTP请求方式
GET
#### 支持格式
JSON
#### 备注
暂无
#### 请求参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 响应参数
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
#### 调用示例
``` javascript
{
  "code": "整数,字段编码",
  "name": "字符串,字段名称",
  "*type": "浮点数,字段类型",
  "*ctrltype": "布尔类型,控件类型,true或者false",
  "object": {
    "code": "字符串,字段编码",
    "name": "字符串,字段名称"
  },
  "array": [
    {
      "code": "字符串,字段编码",
      "name": "字符串,字段名称"
    }
  ],
  "index": "布尔类型,是否索引,true或者false"
}
```
