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


预置模块 preset
======
/api/preset/user | POST
---------------
[系统用户] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*code": "String,编码",
  "password": "String,密码",
  "*email": "String,邮箱",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "password": "String,密码",
  "*email": "String,邮箱",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/preset/user"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "password": "String,密码",
  "*email": "String,邮箱",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```

/api/preset/user | PUT
---------------
系统用户模型默认修改接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "cond": {
    "_id": "57e2a90469e9d9d5524778c8"
  },
  "doc": {
    "*code": "String,编码",
    "password": "String,密码",
    "*email": "String,邮箱",
    "remark": "String,备注",
    "ts": "String,时间戳",
    "dr": "String,删除标记"
  }
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```
#### 调用示例
``` javascript
curl -X PUT -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,编码","password":"String,密码","*email":"String,邮箱","remark":"String,备注","ts":"String,时间戳","dr":"String,删除标记"}}' "http://localhost:3000/preset/user"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/preset/user | DELETE
---------------
系统用户模型默认删除接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "_id": "57e2a90469e9d9d5524778c8"
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "n": 1
}
```
#### 调用示例
``` javascript
curl -X DELETE -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/preset/user"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/preset/user | GET
---------------
系统用户模型默认列表查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "keyword": "查询关键字(模糊匹配所有字符串字段)",
  "flag": "0(分页查询，为默认值)|1(全部查询)",
  "page": "1(页码，从1开始)",
  "size": "20(每页记录数)",
  "sort": "-code(排序字段编码，减号表示逆序，无符号表示升序)"
}
```
#### 响应参数
``` javascript
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,编码",
      "password": "String,密码",
      "*email": "String,邮箱",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/user"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,编码",
      "password": "String,密码",
      "*email": "String,邮箱",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```

/api/preset/user/:id | GET
---------------
系统用户模型默认详情查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "password": "String,密码",
  "*email": "String,邮箱",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/user/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "password": "String,密码",
  "*email": "String,邮箱",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```

/api/preset/param | POST
---------------
[系统参数] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/preset/param"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```

/api/preset/param | PUT
---------------
系统参数模型默认修改接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "cond": {
    "_id": "57e2a90469e9d9d5524778c8"
  },
  "doc": {
    "*code": "String,参数编码",
    "*name": "String,参数名称",
    "*value": "String,参数值",
    "remark": "String,备注",
    "ts": "String,时间戳",
    "dr": "String,删除标记"
  }
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```
#### 调用示例
``` javascript
curl -X PUT -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,参数编码","*name":"String,参数名称","*value":"String,参数值","remark":"String,备注","ts":"String,时间戳","dr":"String,删除标记"}}' "http://localhost:3000/preset/param"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/preset/param | DELETE
---------------
系统参数模型默认删除接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "_id": "57e2a90469e9d9d5524778c8"
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "n": 1
}
```
#### 调用示例
``` javascript
curl -X DELETE -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/preset/param"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/preset/param | GET
---------------
系统参数模型默认列表查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "keyword": "查询关键字(模糊匹配所有字符串字段)",
  "flag": "0(分页查询，为默认值)|1(全部查询)",
  "page": "1(页码，从1开始)",
  "size": "20(每页记录数)",
  "sort": "-code(排序字段编码，减号表示逆序，无符号表示升序)"
}
```
#### 响应参数
``` javascript
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,参数编码",
      "*name": "String,参数名称",
      "*value": "String,参数值",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/param"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,参数编码",
      "*name": "String,参数名称",
      "*value": "String,参数值",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```

/api/preset/param/:id | GET
---------------
系统参数模型默认详情查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/param/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```

/api/preset/commdl | POST
---------------
[测试模型] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*text": "String,文本框",
  "*password": "String,密码",
  "date": "String,日期",
  "time": "String,时间",
  "datetime": "String,日期时间",
  "ts": "String,时间戳",
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "refs2": "String,多引用2",
  "refs3": "String,多引用3",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*text": "String,文本框",
  "*password": "String,密码",
  "date": "String,日期",
  "time": "String,时间",
  "datetime": "String,日期时间",
  "ts": "String,时间戳",
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "refs2": "String,多引用2",
  "refs3": "String,多引用3",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/preset/commdl"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*text": "String,文本框",
  "*password": "String,密码",
  "date": "String,日期",
  "time": "String,时间",
  "datetime": "String,日期时间",
  "ts": "String,时间戳",
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "refs2": "String,多引用2",
  "refs3": "String,多引用3",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片"
}
```

/api/preset/commdl | PUT
---------------
测试模型模型默认修改接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "cond": {
    "_id": "57e2a90469e9d9d5524778c8"
  },
  "doc": {
    "*text": "String,文本框",
    "*password": "String,密码",
    "date": "String,日期",
    "time": "String,时间",
    "datetime": "String,日期时间",
    "ts": "String,时间戳",
    "booleanRadios": "String,单选",
    "booleanCheckbox": "String,多选",
    "number": "Number,数字",
    "textarea": "String,大文本",
    "ref": "String,单引用",
    "refs": "String,多引用",
    "refs2": "String,多引用2",
    "refs3": "String,多引用3",
    "file": "String,单文件/图片",
    "files": "String,多文件/图片"
  }
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```
#### 调用示例
``` javascript
curl -X PUT -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*text":"String,文本框","*password":"String,密码","date":"String,日期","time":"String,时间","datetime":"String,日期时间","ts":"String,时间戳","booleanRadios":"String,单选","booleanCheckbox":"String,多选","number":"Number,数字","textarea":"String,大文本","ref":"String,单引用","refs":"String,多引用","refs2":"String,多引用2","refs3":"String,多引用3","file":"String,单文件/图片","files":"String,多文件/图片"}}' "http://localhost:3000/preset/commdl"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/preset/commdl | DELETE
---------------
测试模型模型默认删除接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "_id": "57e2a90469e9d9d5524778c8"
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "n": 1
}
```
#### 调用示例
``` javascript
curl -X DELETE -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/preset/commdl"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/preset/commdl | GET
---------------
测试模型模型默认列表查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "keyword": "查询关键字(模糊匹配所有字符串字段)",
  "flag": "0(分页查询，为默认值)|1(全部查询)",
  "page": "1(页码，从1开始)",
  "size": "20(每页记录数)",
  "sort": "-code(排序字段编码，减号表示逆序，无符号表示升序)"
}
```
#### 响应参数
``` javascript
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*text": "String,文本框",
      "*password": "String,密码",
      "date": "String,日期",
      "time": "String,时间",
      "datetime": "String,日期时间",
      "ts": "String,时间戳",
      "booleanRadios": "String,单选",
      "booleanCheckbox": "String,多选",
      "number": "Number,数字",
      "textarea": "String,大文本",
      "ref": "String,单引用",
      "refs": "String,多引用",
      "refs2": "String,多引用2",
      "refs3": "String,多引用3",
      "file": "String,单文件/图片",
      "files": "String,多文件/图片"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/commdl"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*text": "String,文本框",
      "*password": "String,密码",
      "date": "String,日期",
      "time": "String,时间",
      "datetime": "String,日期时间",
      "ts": "String,时间戳",
      "booleanRadios": "String,单选",
      "booleanCheckbox": "String,多选",
      "number": "Number,数字",
      "textarea": "String,大文本",
      "ref": "String,单引用",
      "refs": "String,多引用",
      "refs2": "String,多引用2",
      "refs3": "String,多引用3",
      "file": "String,单文件/图片",
      "files": "String,多文件/图片"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```

/api/preset/commdl/:id | GET
---------------
测试模型模型默认详情查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*text": "String,文本框",
  "*password": "String,密码",
  "date": "String,日期",
  "time": "String,时间",
  "datetime": "String,日期时间",
  "ts": "String,时间戳",
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "refs2": "String,多引用2",
  "refs3": "String,多引用3",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/commdl/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*text": "String,文本框",
  "*password": "String,密码",
  "date": "String,日期",
  "time": "String,时间",
  "datetime": "String,日期时间",
  "ts": "String,时间戳",
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "refs2": "String,多引用2",
  "refs3": "String,多引用3",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片"
}
```

/api/preset/signin | post
---------------
登录

#### 支持格式
JSON
#### 备注
暂无
#### 请求参数
``` javascript
{
  "*username": "用户名",
  "*password": "密码"
}
```
#### 响应参数
``` javascript
{
  "*access_token": "84edff70-8014-11e6-9a22-ef95cc3c1a5b",
  "*refresh_token": "84edff71-8014-11e6-9a22-ef95cc3c1a5b",
  "*expires_in": {
    "*access_token": 604800,
    "*refresh_token": 0
  },
  "*_id": "57e2ae8db9a9f22d56f45cdf"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'username=yinfxs&password=yfx1020' "http://localhost:3000/preset/signin"
————————————————————————————————————————————————————
{
  "access_token": "84edff70-8014-11e6-9a22-ef95cc3c1a5b",
  "refresh_token": "84edff71-8014-11e6-9a22-ef95cc3c1a5b",
  "expires_in": {
    "access_token": 604800,
    "refresh_token": 0
  },
  "_id": "57e2ae8db9a9f22d56f45cdf"
}
```


业务模块 business
======
/api/business/dept | POST
---------------
[部门] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*code": "String,编码",
  "*name": "String,名称",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "*name": "String,名称",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/business/dept"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "*name": "String,名称",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```

/api/business/dept | PUT
---------------
部门模型默认修改接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "cond": {
    "_id": "57e2a90469e9d9d5524778c8"
  },
  "doc": {
    "*code": "String,编码",
    "*name": "String,名称",
    "remark": "String,备注",
    "ts": "String,时间戳",
    "dr": "String,删除标记"
  }
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```
#### 调用示例
``` javascript
curl -X PUT -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,编码","*name":"String,名称","remark":"String,备注","ts":"String,时间戳","dr":"String,删除标记"}}' "http://localhost:3000/business/dept"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/business/dept | DELETE
---------------
部门模型默认删除接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "_id": "57e2a90469e9d9d5524778c8"
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "n": 1
}
```
#### 调用示例
``` javascript
curl -X DELETE -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/business/dept"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/business/dept | GET
---------------
部门模型默认列表查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "keyword": "查询关键字(模糊匹配所有字符串字段)",
  "flag": "0(分页查询，为默认值)|1(全部查询)",
  "page": "1(页码，从1开始)",
  "size": "20(每页记录数)",
  "sort": "-code(排序字段编码，减号表示逆序，无符号表示升序)"
}
```
#### 响应参数
``` javascript
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,编码",
      "*name": "String,名称",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/business/dept"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,编码",
      "*name": "String,名称",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```

/api/business/dept/:id | GET
---------------
部门模型默认详情查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "*name": "String,名称",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/business/dept/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,编码",
  "*name": "String,名称",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```

/api/business/param | POST
---------------
[业务参数] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/business/param"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```

/api/business/param | PUT
---------------
业务参数模型默认修改接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "cond": {
    "_id": "57e2a90469e9d9d5524778c8"
  },
  "doc": {
    "*code": "String,参数编码",
    "*name": "String,参数名称",
    "*value": "String,参数值",
    "remark": "String,备注",
    "ts": "String,时间戳",
    "dr": "String,删除标记"
  }
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```
#### 调用示例
``` javascript
curl -X PUT -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,参数编码","*name":"String,参数名称","*value":"String,参数值","remark":"String,备注","ts":"String,时间戳","dr":"String,删除标记"}}' "http://localhost:3000/business/param"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/business/param | DELETE
---------------
业务参数模型默认删除接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "_id": "57e2a90469e9d9d5524778c8"
}
```
#### 响应参数
``` javascript
{
  "ok": 1,
  "n": 1
}
```
#### 调用示例
``` javascript
curl -X DELETE -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/business/param"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/business/param | GET
---------------
业务参数模型默认列表查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "keyword": "查询关键字(模糊匹配所有字符串字段)",
  "flag": "0(分页查询，为默认值)|1(全部查询)",
  "page": "1(页码，从1开始)",
  "size": "20(每页记录数)",
  "sort": "-code(排序字段编码，减号表示逆序，无符号表示升序)"
}
```
#### 响应参数
``` javascript
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,参数编码",
      "*name": "String,参数名称",
      "*value": "String,参数值",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/business/param"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,参数编码",
      "*name": "String,参数名称",
      "*value": "String,参数值",
      "remark": "String,备注",
      "ts": "String,时间戳",
      "dr": "String,删除标记"
    }
  ],
  "totalelements": "4(总记录数)",
  "flag": "0(是否分页，与传入参数一致)",
  "keyword": "当前查询关键字",
  "start": "1(开始记录数)",
  "end": "4(结束记录数)",
  "page": "1(当前页码)",
  "size": "20(当前每页条数)",
  "totalpages": "1(总页数)"
}
```

/api/business/param/:id | GET
---------------
业务参数模型默认详情查询接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/business/param/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,参数编码",
  "*name": "String,参数名称",
  "*value": "String,参数值",
  "remark": "String,备注",
  "ts": "String,时间戳",
  "dr": "String,删除标记"
}
```
