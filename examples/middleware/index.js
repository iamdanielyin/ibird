/**
 * Hello ibird! :)
 * @type {App}
 */

const path = require('path');
const app = require('../../lib/index').newApp();
const logger = require('koa-logger');
const session = require('koa-session');


// 挂载第三方中间件
app.use(logger());
app.keys = ['hello_ibird'];
app.use(session({ key: 'ibird:sess' }, app));
// 挂载自定义中间件
app.use((ctx, next) => {
    console.log('自定义中间件...');
    next();
});
// 自动挂载中间件目录
app.useDir(path.join(__dirname, 'middleware'));


// 挂载测试路由
app.get('/hello', ctx => ctx.body = 'Hello ibird!');
app.get('/session/set', ctx => {
    ctx.session['hello'] = 'ibird';
    ctx.body = 'ok';
});
app.get('/session/get', ctx => {
    ctx.body = ctx.session['hello'];
});
// 启动应用：默认3000端口
app.play();