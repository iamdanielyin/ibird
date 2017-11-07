/**
 * Hello ibird! :)
 * @type {App}
 */

const path = require('path');
const App = require('../../lib/index').App;
const app = new App({
    port: 5000,
    prefix: '/api',
    statics: {
        '/public': path.join(__dirname, 'assets')
    }
});

// 挂载路由
app.get('/hello', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);

// 启动应用
app.play();