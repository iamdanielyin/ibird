/**
 * Hello ibird! :)
 * @type {App}
 */

const path = require('path');
const render = require('koa-ejs');
const app = require('ibird').newApp();

render(app, {
    root: path.join(__dirname, 'view'),
    layout: false,
    viewExt: 'ejs',
    cache: false
});

app.get('/', async ctx => {
    await ctx.render('index', {
        title: 'Hello ibird',
        name: 'ibird & ejs'
    });
});
app.get('/user', async ctx => {
    await ctx.render('user', {
        title: 'Hello ejs',
        name: 'Dan'
    });
});
app.play();