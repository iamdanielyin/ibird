/**
 * Hello ibird! :)
 * @type {App}
 */

const app = require('../../lib/index').newApp();

// 挂载自定义插件
app.import({
    namespace: 'myAddon',
    onLoad: (app) => {
        console.log('Port:', app.c().port);
    },
    enable: {
        hello: (msg) => {
            console.log('ibird-log:', msg);
        }
    }
});
app.get('/', ctx => {
    app.hello(Math.random());
    ctx.body = `Hello ibird.`;
});

app.play(() => {
    app.hello(new Date().toLocaleString());
});