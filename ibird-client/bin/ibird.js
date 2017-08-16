#!/usr/bin/env node

/**
 * 应用执行命令
 * Created by yinfxs on 16-10-23.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const fsx = require('fs-extra');
const _ = require('lodash');
const spawn = require('child_process').spawn;
const argv = process.argv.slice(2);
const yargv = require('yargs').argv;

if (null == argv || argv == 0 || '--help' === argv[0]) {
    console.log('\n  使用: ibird (hot|deploy) 参数\n\n');
    console.log('  --help                     查看帮助\n');
    console.log('  -c,--config arg                     指定ibird.config.js文件地址，绝对路径\n');
    console.log('  -d,--dist arg                     指定输出目录，绝对路径\n');
    console.log('  -p,--port arg                     指定客户端端口\n');
    console.log('  -s,--server arg                     指定服务端地址\n');
    console.log('  -P,--proxy arg                 指定代理接口规则\n');
    process.exit(0);
}

//处理参数
const args = [argv[0]];
var config_path = yargv.config || yargv.c;
var dist_path = yargv.dist || yargv.d;
config_path = config_path && !path.isAbsolute(config_path) ? path.join(process.cwd(), config_path) : config_path;
dist_path = dist_path && !path.isAbsolute(dist_path) ? path.join(process.cwd(), dist_path) : dist_path;
if (config_path) args.push('--config', config_path);
if (dist_path) args.push('--dist', dist_path);

//处理其他参数
if (yargv.port || yargv.p) args.push('--port', yargv.port || yargv.p);
if (yargv.server || yargv.s) args.push('--server', yargv.server || yargv.s);
if (yargv.proxy || yargv.P) args.push('--proxy', yargv.proxy || yargv.P);

//调用gulp命令
const _gulp = spawn('gulp', args, {cwd: path.resolve(__dirname, '../')});

_gulp.stdout.on('data', (data) => {
    console.log(`${data}`);
});

_gulp.stderr.on('data', (data) => {
    console.log(`${data}`);
});

_gulp.on('close', (code) => {
    console.log(`ibird exited with code ${code}`);
});