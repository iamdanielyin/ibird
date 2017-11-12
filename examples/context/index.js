/**
 * Hello ibird! :)
 * @type {App}
 */

const ibird = require('../../lib/index');
const App = ibird.App;
const context = ibird.context;
const ctx = ibird.ctx;
const app = ibird.newApp();
const app2 = ibird.newApp({ name: 'app2', port: 3001 });

console.log('ctx === context', ctx === context);// ctx是context的别名，两者恒等

app.get('/', ctx => ctx.body = context().c());// 获取应用配置
app.get('/config', ctx => ctx.body = context()._config); // c函数返回的就是_config的值，两者恒等
app.get('/context', ctx => ctx.body = context() instanceof App); // contex函数返回的是应用对象
app.get('/ibird', ctx => ctx.body = context() === context('ibird'));// 当不指定应用的name时，系统默认设置为'ibird'

app2.get('/', ctx => ctx.body = context('app2').c()); // 获取'app2'的配置
app2.get('/config', ctx => ctx.body = context('app2')._config);
app2.get('/context', ctx => ctx.body = context('app2') instanceof App);


app.play();
app2.play();