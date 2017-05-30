# 权限模块

> 模块代码：ibird-auth

权限模块只是提供一种方便鉴权的方案，并非完整的权限系统，也不包含用户、角色等概念，它的核心作用是辅助鉴权以及合并多个授权范围，下面会详细描述本模块的设计思路。

## 安装模块

```js
npm i ibird-auth -S
```

## 引用模块

```js
const auth = require('ibird-auth');
```

## 名词说明

* 授权范围：表示一个用户在系统中被授权访问的范围，它由一系列的数据接口和权限列表组成（可以用“角色”来描述权限范围，但本模块并不包含RBAC的相关概念）
* 授权接口：表示授权用户可访问的数据接口，包含查询接口和非查询类接口
* 权限列表：表示与数据接口不直接相关的权限列表，一般包含系统菜单、自定义按钮等（“权限列表”只是现实中权限在系统内的一种标识的集合而已，并无任何业务含义，实际应用中的权限控制，需要开发者结合鉴权结果来完成）

## 模块设计

以下是一个用户在系统内的权限分配情况：

![](/assets/ibird_auth_pre_merge.png)

上图主要描述了以下内容：

1. 该用户具有三个授权范围，分别是授权范围1、授权范围2和授权范围3
2. 每个授权范围皆由授权访问的接口以及其他权限列表组成
3. 授权接口后面包含多个服务地址，每个服务地址后可能会有自己的数据范围限制（查询类服务可指定数据过滤范围，非查询类接口可指定请求参数的操作范围）
4. 权限列表主要描述了与接口无关的前端权限部分，如操作菜单、自定义按钮等

权限模块会对授权范围列表进行合并，会整合所有接口的数据范围以及权限列表，合并后的用户权限如下所示：

![](/assets/ibird_auth_post_merge.png)

## 开放接口

模块对外开放的接口由三部分组成：

* 内部接口：供服务端调用
* 外部路由：供客户端调用
* 中间件：辅助鉴权的Koa中间件，会自动将合并后的授权范围设置到Koa请求的上下文对象中，开发者可自行调用

### 内部接口

* auth.config：初始化所有用户的授权范围
* auth.merge：手动合并多个授权范围
* auth.authentication：鉴权接口，主要用于鉴定用户对指定权限是否操作性
* auth.range：查看指定用户合并后的授权范围
* auth.permissions：查看指定用户合并后的权限列表

可以在每次系统启动前或用户的授权范围有变更时，开发者需要调用初始化接口（config）来初始化用户的权限信息，初始化的数据必须按照以下的格式：

```js
const obj = {
    zhangsan: [
        {
            api: {
                '/api/v1/user|GET': {
                    age: {
                        $gt: 3
                    },
                    sex: '男'
                },
                '/api/v1/order|GET': {
                    status: '待审核',
                    creator: 'zhangsan',
                    org: {
                        $in: ['company1', 'company2']
                    }
                },
                '/api/v1/order|POST': {
                    status: 1,
                    creator: 1,
                    org: 1
                }
            },
            permissions: [
                'custom_button_1',
                'custom_button_2',
                'custom_button_3'
            ]
        },
        {
            api: {
                '/api/v1/order|GET': {
                    status: '新建',
                    creator: 'zhangsan',
                    org: {
                        $in: ['company1', 'company2']
                    }
                }
            },
            permissions: [
                'custom_button_1',
                'custom_button_2',
                'custom_button_3',
                'custom_button_4'
            ]
        }
    ],
    lisi: [
        {
            api: {
                '/api/v1/order|GET': {
                    status: '新建',
                    creator: 'lisi',
                    org: 'company2'
                },
                '/api/v1/order|POST': {
                    status: 1,
                    creator: 1,
                    org: 1
                }
            },
            permissions: [
                'custom_button_1',
                'custom_button_3',
                'custom_button_5'
            ]
        }
    ]
};
```

* 配置对象config中的key为全局用户ID，字符串类型，保证系统内唯一即可；
* value是一个数组，表示系统内该用户的授权范围集合；
* 每个授权范围包含两部分：api和permissions；
* api是授权接口列表，是一个对象类型的数据，以接口地址和请求方式所组成字符串为key，值为数据过滤范围或数据可操作范围；
* permissions是权限列表，字符串数组类型，表示实际权限在系统内的抽象标识。

#### 初始化接口

```js
auth.config(obj); // obj为上面的格式
```

#### 合并授权范围

在调用config接口时，权限模块会自动合并每个用户的授权范围，如果在开发过程中，需要手动合并多个授权范围，可以调用该接口实现：

```js
auth.merge(array); // array为授权范围的数组
```

#### 用户鉴权

传递两个参数，一个是即用户ID（unionid），另一个为权限标识（permission），可以传递权限标识的数组：

```js
// 单个鉴权
auth.authentication('zhangsan', 'custom_button_1');
// 批量鉴权
auth.authentication('zhangsan', ['custom_button_1','custom_button_2']);

// 返回结果
{ custom_button_5: false }
{
    "custom_button_2": false,
    "custom_button_5": true
}
```

#### 查看授权范围

```js
// 第一个参数是用户ID，第二个参数是可选的，表示接口标识，传递时可查询单个接口的范围，不传递时返回所有接口的范围列表
auth.range('lisi', '/api/v1/order|GET');
// 返回
{
  "status": "新建",
  "creator": "lisi",
  "org": "company2"
}


// 不传递第二个参数
auth.range('lisi');
// 返回
{
  "/api/v1/order|GET": {
    "status": "新建",
    "creator": "lisi",
    "org": "company2"
  },
  "/api/v1/order|POST": {
    "status": 1,
    "creator": 1,
    "org": 1
  }
}
```

#### 查看权限列表

```js
// 调用
auth.permissions('lisi');
// 返回
[
  "custom_button_1",
  "custom_button_3",
  "custom_button_5"
]
```

### 外部路由

权限模块包含两个外部路由：

* 'ibird-auth/authentication'：用户鉴权，对指定用户的指定权限进行鉴权
* 'ibird-auth/permissions'：权限列表，查看指定用户的权限列表

#### 用户鉴权

用于针对前端对权限列表进行鉴权，调用方式如下：

```js
// 导出内置鉴权路由
const authentication = require('ibird-auth/authentication');

// 可以直接挂载到ibird中
const app = require('ibird-core');
app.mount(authentication);

// 也可以自行挂载到koa-router中
router.post('/auth', authentication.middleware);
```

> Tips：前端调用时，需要传递两个参数：userid和permission，其中userid是用户ID，permission为需要鉴权的权限列表，多个以英文逗号分隔；userid和permission皆可以指定到URL参数中或请求体中，如果cookies中存在IBIRD\_USERID，则无需传递userid参数

#### 权限列表

前端可以查看指定用户的权限列表，调用方式如下：

```js
// 导出内置鉴权路由
const permissions = require('ibird-auth/permissions');

// 可以直接挂载到ibird中
const app = require('ibird-core');
app.mount(permissions);

// 也可以自行挂载到koa-router中
router.post('/permissionsList', permissions.middleware);
```

> Tips：前端调用时，需要传递userid，即用户ID，userid可以指定到URL参数中或请求体中，如果cookies中存在IBIRD\_USERID，则无需传递该参数

### 中间件

权限模块也包含一个内置中间件，可方便获取用户的授权范围，调用方式如下：

```js
// 可以直接挂载到ibird中，ibird默认生成的接口将自动过滤
const app = require('ibird-core');
app.config().middleware.push(require('ibird-auth/middleware/auth'));

// 也可以自行挂载到koa中
app.use(require('ibird-auth/middleware/auth').middleware);
```

> Tips：挂载中间成功后，可以直接在接口的上下文对象中，通过ctx.\_range获取到对应接口的授权范围。
