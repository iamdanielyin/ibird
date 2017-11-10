/**
 * Hello ibird! :)
 * @type {App}
 */

const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const app = require('../../lib/index').newApp();

app.get('/', async ctx => {
    const template = fs.readFileSync(path.join(__dirname, 'view/index.html')).toString();
    ctx.body = Mustache.render(template, {
        title: 'Hello ibird',
        name: 'ibird & Mustache'
    });
});
app.get('/user', async ctx => {
    const template = fs.readFileSync(path.join(__dirname, 'view/user.html')).toString();
    ctx.body = Mustache.render(template, {
        title: 'Hello Mustache',
        name: 'Dan'
    });
});
app.play();