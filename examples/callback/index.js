/**
 * Hello ibird! :)
 * @type {App}
 */

const app = require('../../lib/index').newApp();
app.get('/', ctx => ctx.body = `Hello ibird.`);


/**
 //临时指定端口
 app.play(3001, () => {
    console.log('本地访问地址：', `http://127.0.0.1:${app.c().port}`);
 });
 **/

app.play(() => {
    console.log('本地访问地址：', `http://127.0.0.1:${app.c().port}`);
});