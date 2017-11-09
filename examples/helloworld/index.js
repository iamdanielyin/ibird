/**
 * Hello ibird! :)
 * @type {App}
 */

const app = require('../../lib/index').newApp();
app.get('/', ctx => ctx.body = `Hello ibird.`);
app.play();