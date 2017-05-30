# 国际化处理

> 模块代码：ibird-i18n

ibird通过该模块提供国际化处理，国际化模块在设计上和ibird完全独立的，你可以选择结合ibird使用，也可单独使用。

## 内部组成

国际化内部由两部分组成：

1. 国际化配置对象列表
2. 当前正使用的国际化配置对象

## 引用模块

使用国际化模块的第一步，先引入国际化模块：

```js
const i18n = require('ibird-i18n');
```

国际化模块提供两个核心接口供开发者调用：

1. 注册、获取、切换国际化配置：i18n.locale
2. 获取国际化内容值：i18n.get

### 注册新的配置

模块提供单独注册和批量注册两种方式，单独注册方式如下：

```js
const i18n = require('ibird-i18n');
// 单独注册：注册简体中文
i18n.locale('zh-cn', {
        i18n_app_name: 'ibird应用',
        i18n_model_user: '用户档案',
        i18n_model_blog: '博客档案',
        i18n_route_auth_error: err => `授权失败，异常信息：${e.message}`,
        i18n_app_run_success: (host, port) => `应用正常启动，访问地址：${host}:${port}`,
        i18n_route_params_error: '参数不正确'
    }
);
// 单独注册：注册美国英文
i18n.locale('en-us', {
        i18n_app_name: 'ibird App',
        i18n_model_user: 'Users',
        i18n_model_blog: 'Blogs',
        i18n_route_auth_error: err => `Unauthorized operation:${e.message}`,
        i18n_app_run_success: (host, port) => `Application starts successfully, please open:${host}:${port}`,
        i18n_route_params_error: 'Parameter error'
    }
);
```

批量注册方式如下：

```js
const i18n = require('ibird-i18n');
// 批量注册
i18n.locale({
        'zh-cn': {
            i18n_app_name: 'ibird应用',
            i18n_model_user: '用户档案',
            i18n_model_blog: '博客档案',
            i18n_route_auth_error: err => `授权失败，异常信息：${e.message}`,
            i18n_app_run_success: (host, port) => `应用正常启动，访问地址：${host}:${port}`,
            i18n_route_params_error: '参数不正确'
        },
        'en-us': {
            i18n_app_name: 'ibird App',
            i18n_model_user: 'Users',
            i18n_model_blog: 'Blogs',
            i18n_route_auth_error: err => `Unauthorized operation:${e.message}`,
            i18n_app_run_success: (host, port) => `Application starts successfully, please open:${host}:${port}`,
            i18n_route_params_error: 'Parameter error'
        }
    }
);
```

> Tips：国际化配置对象为JavaScript对象类型，key与value皆自定义决定，其中key为字符串类型，value为字符串类型或函数类型，当值为静态值时，直接设置为字符串类型；当值需要传递参数时，则定义为函数值类型，函数的参数值在获取国际化内容值时自行传递。

### 获取应用中的配置

```js
const i18n = require('ibird-i18n');
// 返回正被应用的国际化配置对象
const current = i18n.locale();
```

### 切换国际化配置

```js
const i18n = require('ibird-i18n');
// 切换简体中文
i18n.locale('zh-cn');
// 切换美国英文
i18n.locale('en-us');
```

> Tips：locale中传递的值为注册时指定的编码，如果指定编码找不到对应的国际化配置，则保持原配置不变。

### 获取国际化内容值

以上所描述的，全是和配置相关的事情，下面说明国际化配置正确以后应当如何使用：

```js
const i18n = require('ibird-i18n');
// 获取指定国际化值
// key：国际化配置对象中配置的key，如i18n_app_name
// param1~paramn：参数列表，当key对应的值为函数类型时，这些参数会作为实参传入函数
const value = i18n.get(key, param1, param2, param3, ..., paramn);

// 调用示例：
// 假设模块中已注册上面提到的zh-cn、en-us两个国际化配置对象
// 获取用户档案的国际化内容
const users = i18n.get('i18n_model_user');
// 获取系统启动成功的国际化内容
console.log(i18n.get('i18n_app_run_success', 'http://www.example.com', 3000));
```



