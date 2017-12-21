/**
 * Hello ibird! :)
 * @type {App}
 */

const loggerAddon = require('ibird-logger');
const app = require('ibird').newApp();

// 挂载自定义插件
app.import(loggerAddon);
app.import({
    namespace: 'myAddon',
    onLoad: (app) => {
        console.log('myAddon:', `应用端口为${app.c().port}`);
    },
    api: {
        hello: (msg) => {
            console.log('myAddon:', msg);
        }
    }
});
app.get('/', ctx => {
    app.hello(Math.random());
    app.error('日志输出error...error');
    app.warn('日志输出warn...warn');
    app.info('日志输出info...info');
    app.verbose('日志输出verbose...verbose');
    app.debug('日志输出debug...debug');
    app.silly('日志输出silly...silly');
    ctx.body = 'Hello ibird.';
});

app.play(() => {
    app.hello(new Date().toLocaleString());
    app.info('测试日志输出...');
});