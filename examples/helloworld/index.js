/**
 * Hello ibird! :)
 * @type {App}
 */

const app = require('ibird').newApp();
app.get('/', ctx => ctx.body = `Hello ibird.`);
app.play();