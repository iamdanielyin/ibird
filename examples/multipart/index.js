/**
 * Hello ibird! :)
 * @type {App}
 */
const path = require('path');
const dir = path.join(__dirname, 'assets');
const app = require('ibird').newApp({
    uploadDir: dir,
    statics: {
        '/public': dir
    }
});

/**
 备注：上传的文件名默认会被重写，如需自定义文件名，可额外指定bodyOpts参数项（如下例子使用原文件名）：
 bodyOpts: {
    formidable: {
        onFileBegin: (name, file) => {
            const parse = path.parse(file.path);
            file.path = path.join(parse.dir, file.name);
            return file;
        }
    }
 }
 **/

// 挂载测试路由
app.post('/upload', ctx => {
    ctx.body = ctx.request.body;
});

// 启动应用：默认3000端口
app.play();