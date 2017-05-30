# 令牌模块

> 模块代码：ibird-token

这是一个通用化的令牌模块，仅提供应用中需要的令牌管理功能。

## 安装模块

```javascript
npm i ibird-token -D
```

## 使用方式

首先第一步，引用模块：

```javascript
const token = require('ibird-token');
```

以下是该模块开放的全部接口：

1. token.config：模块配置接口，主要用于配置令牌的存储模式，目前支持内存模式（默认）、Redis模式、自定义模式三种；
2. token.authorization：授权接口，通过传递一个授权条件（函数类型，返回类型为Promise对象）来判断是否下发新的令牌；
3. token.authentication：鉴权接口，判断令牌的有效性；
4. token.refresh：刷新接口，通过更新令牌来更新访问令牌；
5. token.remove：删除接口，令牌对象具有一定的有效时间，超过有效期会自动过期，调用该接口将使令牌立即过期。

> Tips：除了config接口外，其余接口返回类型皆为Promise类型。

### 模块配置

通过调用token.config接口对模块进行配置，使用方式如下所示：

```javascript
// 采用内存模式，默认模式
token.config();

// 启用Redis存储模式
token.config({
    redis: 'redis://127.0.0.1:6379'
});

// 启用自定义存储模式，需要指定以下几个配置函数，分别用于自行管理token
token.config({
    token: {
        get: (access_token) => {
            // 这里需要自行查询并返回token对象
            // 返回类型为Promise
            return Promise.resolve(token);
        },
        set: (token) => {
            // 这里需要自行保存token对象
            // 返回类型为Promise
        },
        remove: (token) => {
            // 这里需要自行删除token对象
            // 返回类型为Promise
        },
        refresh: (token) => {
            // 这里需要自行刷新token对象
            // 返回类型为Promise
        }
    }
});
```

### 授权接口

授权接口的调用需要传递一个授权条件（函数类型）作为参数，且该授权函数的返回类型需为Promise对象，接口通过判断该Promise对象的状态来决定是否下发新的令牌。当授权条件为resolve时，该接口也返回resolve，并带上新的令牌对象，否则将返回Promise.reject，下面是一段调用的伪代码：

```javascript
// 采用Promise方式获取新令牌对象
token.authorization(() => {
    if (1 != 1) {
        return Promise.reject();
    }
    return Promise.resolve(1 == 1);
}).then(_token => {
    // _token即为令牌对象
    console.log(_token);
}).catch(e => console.error(e.message));

// 或者采用async/await方式
try {
    const _token = await token.authorization(() => {
        if (1 != 1) {
            return Promise.reject();
        }
        return Promise.resolve(1 == 1);
    });
} catch (e) {
    console.error(e.message);
}
```

### 令牌对象

令牌对象的格式是固定的，下面是一个示例：

```javascript
{
    "access_token": "2e0ca140-22c9-11e7-89bc-596b463da370",
    "refresh_token": "2e0ca141-22c9-11e7-89bc-596b463da370",
    "expires_in": {
        "access_token": 604800,
        "refresh_token": 0
    },
    "created": 1492410056,
    "data": {/* 额外数据部分，为授权条件函数的返回值 */}
}
```

* access\_token：访问令牌，主要用于业务处理
* refresh\_token：刷新令牌，仅用于在访问令牌过期后刷新access\_token
* expires\_in.access\_token：访问令牌的有效期，单位秒，0为永不过期
* expires\_in.refresh\_token：刷新令牌的有效期，单位秒，0为永不过期
* created：创建时间，UNIX时间戳

>Tips：在自定义接口中，可通过ctx._token的方式来获取服务端令牌对象。

### 鉴权接口

开发者通过调用该接口来判断令牌的有效性，传递参数为访问令牌，调用方式如下：

```javascript
try {
    // 传入访问令牌
    await token.authentication(access_token);
    // 鉴权通过
} catch (e) {
    // 鉴权失败，令牌不合法
    console.error(e.message);
}
```

### 刷新接口

当访问令牌过期后，通过传递刷新令牌来获取新的访问令牌：

```javascript
try {
    // 刷新访问令牌
    const _token = await token.refresh(refresh_token);
    // _token为新的令牌对象，其中_token.access_token为新的访问令牌
    console.log(_token.access_token);
} catch (e) {
    console.error(e.message);
}
```

### 删除接口

令牌超过有效时间后会自动过期，如果需要使令牌马上过期，可调用该接口立即删除令牌：

```javascript
try {
    // 删除令牌
    await token.remove(access_token);
} catch (e) {
    console.error(e.message);
}
```

## 扩展功能

如果你使用ibird作为开发框架，本模块提供一些内置中间件和路由供你使用，包括令牌鉴权中间件、登录、退出路由等，通过简单配置即可快速接入账户功能。

使用内置令牌鉴权中间件：

```javascript
const app = require('ibird-core');
// 导出令牌验证中间件
const middleware = require('ibird-token/middleware/token');
// 挂载到ibird中
app.config().middware.push(middleware);
```

如果需要使用内置路由，需要在模块配置时指定user参数：

```javascript
// 使用内置路由前的配置
token.config({
    user: {
        params: ['username', 'password'], // 自定义指定路由请求中的参数名
        get: (obj) => {
            // 传递一个获取用户数据的函数
            // 该函数接收一个由params所指定的请求参数名与请求参数值所组成的对象
            const username = obj.username;
            const password = obj.password;
            // 自行根据传入数据查询并返回用户对象
            // 返回类型为Promise
            const user = ...
            return Promise.resolve(user);
        },
        userid: 'userid' // 指定get函数返回的对象中，用户ID的参数key，默认为_id
    },
    ignoreURLs: [/signin/, {url: '/signin',method: 'GET' }]
});
```

然后就可以愉快滴玩耍了：

```javascript
const app = require('ibird-core');
const token = require('ibird-token');

app.import(token);
```

