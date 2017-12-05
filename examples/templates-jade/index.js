/**
 * Hello ibird! :)
 * @type {App}
 */

const path = require('path');
const jade = require('jade');
const app = require('ibird').newApp();

app.get('/', async ctx => {
    ctx.body = jade.renderFile(path.join(__dirname, 'view/index.jade'), {
        title: 'Hello ibird',
        name: 'ibird & jade'
    });
});
app.get('/user', async ctx => {
    ctx.body = jade.renderFile(path.join(__dirname, 'view/user.jade'), {
        title: 'Hello jade',
        name: 'Dan'
    });
});
app.play();