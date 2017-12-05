/**
 * Hello ibird! :)
 * @type {App}
 */

const app = require('ibird').newApp({
    port: 80,
    statics: {
        '/': __dirname + '/assets'
    }
});

// 启动应用
app.play();