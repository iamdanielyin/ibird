/**
 * Hello ibird! :)
 * @type {App}
 */

const App = require('../../lib/index').App;
const app = new App();

// 挂载自定义路由
app.get('/hello', ctx => ctx.body = `Hello ibird（${new Date().toLocaleString()}）!`);

// 启动应用：默认3000端口
app.play();