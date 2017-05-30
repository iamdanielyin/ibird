'use strict';

/**
 * 默认存储模式
 * Created by yinfxs on 2017/4/17.
 */

const token = require('../index');

token.config({
    redis:'redis://:ibird123@127.0.0.1:6012/0',
    expires_in: {
        access_token: 5,
        refresh_token: 10
    }
});

async function fn() {
    try {
        let item = await token.authorization(true);
        console.log('获取令牌成功：' + item.access_token);
        const it = setInterval(async () => {
            token.authentication(item.access_token).then(item => {
                console.log('获取令牌成功：' + item.access_token);
            }).catch(async (e) => {
                console.error('访问令牌失效，刷新访问令牌');
                try {
                    item = await token.refresh(item.refresh_token);
                } catch (e) {
                    console.error('刷新令牌失效');
                    clearInterval(it);
                }
            });
        }, 1000);
    } catch (e) {
        console.log(e);
    }
}

fn();