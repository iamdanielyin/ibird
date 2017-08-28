# 文档介绍

1. 为了快速实现系统的开放式对接，降低应用与外部系统对接的成本，提高工作效率，现将系统内的API文档开放如下。
2. 该文档按模块列举了系统内开放的接口，并对每个接口的调用进行了详细地说明。
3. 具体包括每个接口的接口地址、接口描述、数据格式、请求方式、请求参数、响应参数和调用示例等。
4. 接口统一为RESTful接口，UTF-8编码，请求参数按请求方式的不同可设置到请求体或查询参数中。

**备注：** 

1. 所有接口参数前若带有星（*）号，则表示该项参数为必填项； 
2. 所有接口参数若未额外说明，则默认约定为字符串类型；
3. 该文档内并不包含接口的访问域名（或IP）和端口信息，如有需要，请联系系统管理员。 


预置模块 preset
======
/api/preset/user | POST
---------------
[用户档案] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*code": "String,帐号",
  "password": "String,密码",
  "email": "String,邮箱",
  "roles": "String,分配角色",
  "*name": "String,名称",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,帐号",
  "password": "String,密码",
  "email": "String,邮箱",
  "roles": "String,分配角色",
  "*name": "String,名称",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/preset/user"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,帐号",
  "password": "String,密码",
  "email": "String,邮箱",
  "roles": "String,分配角色",
  "*name": "String,名称",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```

/api/preset/user | PUT
---------------
用户档案模型默认修改接口

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
    "*code": "String,帐号",
    "password": "String,密码",
    "email": "String,邮箱",
    "roles": "String,分配角色",
    "*name": "String,名称",
    "org": "String,所属机构",
    "*creater": "String,创建人",
    "*modifier": "String,修改人",
    "*created": "String,创建时间",
    "*modified": "String,修改时间",
    "*dr": "String,删除标记",
    "remark": "String,备注"
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
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,帐号","password":"String,密码","email":"String,邮箱","roles":"String,分配角色","*name":"String,名称","org":"String,所属机构","*creater":"String,创建人","*modifier":"String,修改人","*created":"String,创建时间","*modified":"String,修改时间","*dr":"String,删除标记","remark":"String,备注"}}' "http://localhost:3000/preset/user"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/preset/user | DELETE
---------------
用户档案模型默认删除接口

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
用户档案模型默认列表查询接口

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
      "*code": "String,帐号",
      "password": "String,密码",
      "email": "String,邮箱",
      "roles": "String,分配角色",
      "*name": "String,名称",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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
      "*code": "String,帐号",
      "password": "String,密码",
      "email": "String,邮箱",
      "roles": "String,分配角色",
      "*name": "String,名称",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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
用户档案模型默认详情查询接口

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
  "*code": "String,帐号",
  "password": "String,密码",
  "email": "String,邮箱",
  "roles": "String,分配角色",
  "*name": "String,名称",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/user/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,帐号",
  "password": "String,密码",
  "email": "String,邮箱",
  "roles": "String,分配角色",
  "*name": "String,名称",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```

/api/preset/org | POST
---------------
[机构档案] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "_id": "String,机构标识",
  "*code": "String,机构编码",
  "*name": "String,机构名称",
  "pid": "String,上级机构",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 响应参数
``` javascript
{
  "_id": "String,机构标识",
  "*code": "String,机构编码",
  "*name": "String,机构名称",
  "pid": "String,上级机构",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/preset/org"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "String,机构标识",
  "*code": "String,机构编码",
  "*name": "String,机构名称",
  "pid": "String,上级机构",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```

/api/preset/org | PUT
---------------
机构档案模型默认修改接口

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
    "_id": "String,机构标识",
    "*code": "String,机构编码",
    "*name": "String,机构名称",
    "pid": "String,上级机构",
    "org": "String,所属机构",
    "*creater": "String,创建人",
    "*modifier": "String,修改人",
    "*created": "String,创建时间",
    "*modified": "String,修改时间",
    "*dr": "String,删除标记",
    "remark": "String,备注"
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
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"_id":"String,机构标识","*code":"String,机构编码","*name":"String,机构名称","pid":"String,上级机构","org":"String,所属机构","*creater":"String,创建人","*modifier":"String,修改人","*created":"String,创建时间","*modified":"String,修改时间","*dr":"String,删除标记","remark":"String,备注"}}' "http://localhost:3000/preset/org"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/preset/org | DELETE
---------------
机构档案模型默认删除接口

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
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/preset/org"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/preset/org | GET
---------------
机构档案模型默认列表查询接口

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
      "_id": "String,机构标识",
      "*code": "String,机构编码",
      "*name": "String,机构名称",
      "pid": "String,上级机构",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/org"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "String,机构标识",
      "*code": "String,机构编码",
      "*name": "String,机构名称",
      "pid": "String,上级机构",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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

/api/preset/org/:id | GET
---------------
机构档案模型默认详情查询接口

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
  "_id": "String,机构标识",
  "*code": "String,机构编码",
  "*name": "String,机构名称",
  "pid": "String,上级机构",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/org/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "String,机构标识",
  "*code": "String,机构编码",
  "*name": "String,机构名称",
  "pid": "String,上级机构",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```

/api/preset/resource | POST
---------------
[资源管理] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*code": "String,资源编码",
  "*name": "String,资源名称",
  "*type": "String,资源类型",
  "tag": "String,分组标识",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,资源编码",
  "*name": "String,资源名称",
  "*type": "String,资源类型",
  "tag": "String,分组标识",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/preset/resource"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,资源编码",
  "*name": "String,资源名称",
  "*type": "String,资源类型",
  "tag": "String,分组标识",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```

/api/preset/resource | PUT
---------------
资源管理模型默认修改接口

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
    "*code": "String,资源编码",
    "*name": "String,资源名称",
    "*type": "String,资源类型",
    "tag": "String,分组标识",
    "org": "String,所属机构",
    "*creater": "String,创建人",
    "*modifier": "String,修改人",
    "*created": "String,创建时间",
    "*modified": "String,修改时间",
    "*dr": "String,删除标记",
    "remark": "String,备注"
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
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,资源编码","*name":"String,资源名称","*type":"String,资源类型","tag":"String,分组标识","org":"String,所属机构","*creater":"String,创建人","*modifier":"String,修改人","*created":"String,创建时间","*modified":"String,修改时间","*dr":"String,删除标记","remark":"String,备注"}}' "http://localhost:3000/preset/resource"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/preset/resource | DELETE
---------------
资源管理模型默认删除接口

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
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/preset/resource"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/preset/resource | GET
---------------
资源管理模型默认列表查询接口

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
      "*code": "String,资源编码",
      "*name": "String,资源名称",
      "*type": "String,资源类型",
      "tag": "String,分组标识",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/resource"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,资源编码",
      "*name": "String,资源名称",
      "*type": "String,资源类型",
      "tag": "String,分组标识",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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

/api/preset/resource/:id | GET
---------------
资源管理模型默认详情查询接口

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
  "*code": "String,资源编码",
  "*name": "String,资源名称",
  "*type": "String,资源类型",
  "tag": "String,分组标识",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/resource/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,资源编码",
  "*name": "String,资源名称",
  "*type": "String,资源类型",
  "tag": "String,分组标识",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```

/api/preset/role | POST
---------------
[角色管理] 模型默认新增接口

#### 支持格式
JSON
#### 备注
其他
#### 请求参数
``` javascript
{
  "*code": "String,角色编码",
  "*name": "String,角色名称",
  "scope": "String,数据范围",
  "resources": "String,关联资源",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 响应参数
``` javascript
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,角色编码",
  "*name": "String,角色名称",
  "scope": "String,数据范围",
  "resources": "String,关联资源",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"
 -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/preset/role"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,角色编码",
  "*name": "String,角色名称",
  "scope": "String,数据范围",
  "resources": "String,关联资源",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```

/api/preset/role | PUT
---------------
角色管理模型默认修改接口

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
    "*code": "String,角色编码",
    "*name": "String,角色名称",
    "scope": "String,数据范围",
    "resources": "String,关联资源",
    "org": "String,所属机构",
    "*creater": "String,创建人",
    "*modifier": "String,修改人",
    "*created": "String,创建时间",
    "*modified": "String,修改时间",
    "*dr": "String,删除标记",
    "remark": "String,备注"
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
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,角色编码","*name":"String,角色名称","scope":"String,数据范围","resources":"String,关联资源","org":"String,所属机构","*creater":"String,创建人","*modifier":"String,修改人","*created":"String,创建时间","*modified":"String,修改时间","*dr":"String,删除标记","remark":"String,备注"}}' "http://localhost:3000/preset/role"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "nModified": 0,
  "n": 0
}
```

/api/preset/role | DELETE
---------------
角色管理模型默认删除接口

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
 -H "Cache-Control: no-cache" -d '{"_id":"57e2a90469e9d9d5524778c8"}' "http://localhost:3000/preset/role"
————————————————————————————————————————————————————————————————————————————
{
  "ok": 1,
  "n": 1
}
```

/api/preset/role | GET
---------------
角色管理模型默认列表查询接口

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
      "*code": "String,角色编码",
      "*name": "String,角色名称",
      "scope": "String,数据范围",
      "resources": "String,关联资源",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/role"
————————————————————————————————————————————————————————————————————————————
{
  "data": [
    {
      "_id": "57e2ac2e471795945455cc9d",
      "*code": "String,角色编码",
      "*name": "String,角色名称",
      "scope": "String,数据范围",
      "resources": "String,关联资源",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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

/api/preset/role/:id | GET
---------------
角色管理模型默认详情查询接口

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
  "*code": "String,角色编码",
  "*name": "String,角色名称",
  "scope": "String,数据范围",
  "resources": "String,关联资源",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
}
```
#### 调用示例
``` javascript
curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"
 -H "Cache-Control: no-cache" "http://localhost:3000/preset/role/57e2ae8db9a9f22d56f45cdf"
————————————————————————————————————————————————————————————————————————————
{
  "_id": "57e2ac2e471795945455cc9d",
  "*code": "String,角色编码",
  "*name": "String,角色名称",
  "scope": "String,数据范围",
  "resources": "String,关联资源",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
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
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "editor": "String,编辑器",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
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
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "editor": "String,编辑器",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
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
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "editor": "String,编辑器",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
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
    "booleanRadios": "String,单选",
    "booleanCheckbox": "String,多选",
    "number": "Number,数字",
    "textarea": "String,大文本",
    "editor": "String,编辑器",
    "ref": "String,单引用",
    "refs": "String,多引用",
    "file": "String,单文件/图片",
    "files": "String,多文件/图片",
    "org": "String,所属机构",
    "*creater": "String,创建人",
    "*modifier": "String,修改人",
    "*created": "String,创建时间",
    "*modified": "String,修改时间",
    "*dr": "String,删除标记",
    "remark": "String,备注"
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
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*text":"String,文本框","*password":"String,密码","date":"String,日期","time":"String,时间","datetime":"String,日期时间","booleanRadios":"String,单选","booleanCheckbox":"String,多选","number":"Number,数字","textarea":"String,大文本","editor":"String,编辑器","ref":"String,单引用","refs":"String,多引用","file":"String,单文件/图片","files":"String,多文件/图片","org":"String,所属机构","*creater":"String,创建人","*modifier":"String,修改人","*created":"String,创建时间","*modified":"String,修改时间","*dr":"String,删除标记","remark":"String,备注"}}' "http://localhost:3000/preset/commdl"
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
      "booleanRadios": "String,单选",
      "booleanCheckbox": "String,多选",
      "number": "Number,数字",
      "textarea": "String,大文本",
      "editor": "String,编辑器",
      "ref": "String,单引用",
      "refs": "String,多引用",
      "file": "String,单文件/图片",
      "files": "String,多文件/图片",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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
      "booleanRadios": "String,单选",
      "booleanCheckbox": "String,多选",
      "number": "Number,数字",
      "textarea": "String,大文本",
      "editor": "String,编辑器",
      "ref": "String,单引用",
      "refs": "String,多引用",
      "file": "String,单文件/图片",
      "files": "String,多文件/图片",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间",
      "*dr": "String,删除标记",
      "remark": "String,备注"
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
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "editor": "String,编辑器",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
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
  "booleanRadios": "String,单选",
  "booleanCheckbox": "String,多选",
  "number": "Number,数字",
  "textarea": "String,大文本",
  "editor": "String,编辑器",
  "ref": "String,单引用",
  "refs": "String,多引用",
  "file": "String,单文件/图片",
  "files": "String,多文件/图片",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间",
  "*dr": "String,删除标记",
  "remark": "String,备注"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
    "*dr": "String,删除标记",
    "org": "String,所属机构",
    "*creater": "String,创建人",
    "*modifier": "String,修改人",
    "*created": "String,创建时间",
    "*modified": "String,修改时间"
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
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,编码","*name":"String,名称","remark":"String,备注","ts":"String,时间戳","*dr":"String,删除标记","org":"String,所属机构","*creater":"String,创建人","*modifier":"String,修改人","*created":"String,创建时间","*modified":"String,修改时间"}}' "http://localhost:3000/business/dept"
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
      "*dr": "String,删除标记",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间"
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
      "*dr": "String,删除标记",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
    "*dr": "String,删除标记",
    "org": "String,所属机构",
    "*creater": "String,创建人",
    "*modifier": "String,修改人",
    "*created": "String,创建时间",
    "*modified": "String,修改时间"
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
 -H "Cache-Control: no-cache" -d '{"cond":{"_id":"57e2a90469e9d9d5524778c8"},"doc":{"*code":"String,参数编码","*name":"String,参数名称","*value":"String,参数值","remark":"String,备注","ts":"String,时间戳","*dr":"String,删除标记","org":"String,所属机构","*creater":"String,创建人","*modifier":"String,修改人","*created":"String,创建时间","*modified":"String,修改时间"}}' "http://localhost:3000/business/param"
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
      "*dr": "String,删除标记",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间"
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
      "*dr": "String,删除标记",
      "org": "String,所属机构",
      "*creater": "String,创建人",
      "*modifier": "String,修改人",
      "*created": "String,创建时间",
      "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
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
  "*dr": "String,删除标记",
  "org": "String,所属机构",
  "*creater": "String,创建人",
  "*modifier": "String,修改人",
  "*created": "String,创建时间",
  "*modified": "String,修改时间"
}
```
