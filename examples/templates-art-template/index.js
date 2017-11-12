/**
 * Hello ibird! :)
 * @type {App}
 */

const path = require('path');
const render = require('koa-art-template');
const app = require('../../lib/index').newApp();

render(app, {
    root: path.join(__dirname, 'view'),
    extname: '.art'
});

app.get('/', async ctx => {
    await ctx.render('index', {
        title: 'Hello ibird',
        name: 'ibird & art-template'
    });
});
app.get('/user', async ctx => {
    await ctx.render('user', {
        title: 'Hello art-template',
        name: 'Dan'
    });
});
app.play();