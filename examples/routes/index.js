/**
 * Hello ibird! :)
 * @type {App}
 */

const path = require('path');
const App = require('../../lib/index').App;
const app = new App();

// 可通过 'prefix' 配置项指定全局前缀
/**
    const app = new App({
        prefix: '/api'
    });
**/

// 快速挂载路由
app.get('/hello', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
app.post('/hello/post', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
app.put('/hello/put', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
app.patch('/hello/patch', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
app.delete('/hello/delete', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);

// 挂载路由组
app.mount((router)=>{
    router.get('/group/test1', ctx => ctx.body = 'Hello ibird!');
    router.get('/group/test2', ctx => ctx.body = 'Hello test2!');
});

// 自动挂载路由目录
app.mountDir(path.join(__dirname, 'routes'));


// 启动应用：默认3000端口
app.play();