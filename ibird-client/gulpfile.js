/**
 * gulp文件
 * Created by yinfxs on 16-9-3.
 */

const gulp = require('gulp');
const gutil = require('gulp-util');
const assign = require('object-assign');
const fs = require('fs-extra');
const runSequence = require('run-sequence');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");
const argv = require('yargs').argv;
var config = require('./webpack.config');
const port = argv.port || 1221, server = argv.server || 'http://127.0.0.1:3000';

let proxy = {};
if (argv.proxy) {
    const rules = argv.proxy.split(',');
    rules.forEach(function (rule) {
        if (!rule) return;
        proxy[rule] = {
            target: server,
            secure: false
        };
    })
} else {
    proxy = {
        '/api/**/*': {
            target: server,
            secure: false
        },
        '/public/**/*': {
            target: server,
            secure: false
        }
    }
}

// webpack
gulp.task('webpack', function (callback) {
    fs.emptyDirSync(config.output.path);//清空历史
    assign(config, {devtool: 'source-map', debug: true});
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            color: true
        }));
        callback();
    });
});

// webpack-dev-server
gulp.task('webpack-dev-server', function (callback) {
    assign(config, {devtool: 'eval', debug: true});
    config.entry.app.unshift("webpack-dev-server/client?http://localhost:" + port, "webpack/hot/dev-server");
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    const compiler = webpack(config);
    new WebpackDevServer(compiler, {
        contentBase: config.output.path,
        hot: true,
        inline: true,
        stats: {
            color: true
        },
        proxy: proxy
    }).listen(port, function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server] - " + "[http://localhost:" + port + "]");
        callback();
    });
});


// 生产环境构建任务
gulp.task('webpack-deploy', function (callback) {
    fs.emptyDirSync(config.output.path);//清空历史
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            color: true
        }));
        callback();
    });
});


gulp.task("build", function (callback) {
    preTask();
    runSequence(['webpack'], callback);
});
gulp.task("hot", function (callback) {
    preTask();
    runSequence(['webpack', 'webpack-dev-server'], callback);
});
gulp.task("deploy", function (callbaclk) {
    preTask();
    runSequence(['webpack-deploy'], callbaclk);
});

// 注册默认任务
gulp.task('default', function (callback) {
    preTask();
    runSequence(['build'], callback);
});

/**
 * 任务执行前处理
 */
function preTask() {
    const config_path = argv.config && !path.isAbsolute(argv.config) ? path.resolve(process.cwd(), argv.config) : argv.config;
    const dist_path = argv.dist && !path.isAbsolute(argv.dist) ? path.resolve(process.cwd(), argv.dist) : argv.dist;
    config = config(config_path, dist_path);
}