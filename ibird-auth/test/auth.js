'use strict';

/**
 * 鉴权测试
 * Created by yinfxs on 2017/4/18.
 */

const auth = require('../index');

// 初始化范围
const config = {
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

// 注册配置
const result = auth.config(config);

// 合并后结果
console.log(JSON.stringify(result, null, 2));

// 鉴权
console.log(auth.authentication('zhangsan', 'custom_button_1'));
console.log(auth.authentication('zhangsan', 'custom_button_2'));
console.log(auth.authentication('zhangsan', 'custom_button_3'));
console.log(auth.authentication('zhangsan', 'custom_button_4'));
console.log(auth.authentication('zhangsan', 'custom_button_5'));


console.log(JSON.stringify(auth.authentication('lisi', ['custom_button_2', 'custom_button_5']), null, 2));


console.log(JSON.stringify(auth.range('lisi', '/api/v1/order|GET'), null, 2));
console.log(JSON.stringify(auth.range('lisi'), null, 2));
console.log(JSON.stringify(auth.permissions('lisi'), null, 2));

// 可以直接挂载到ibird中
const app = require('ibird-core');
app.config().middleware.push(require('ibird-auth/middleware/auth'));

// 也可以自行挂载到koa中
app.use(require('ibird-auth/middleware/auth').middleware);