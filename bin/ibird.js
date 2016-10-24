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
const exec = require('child_process').exec;
const argv = process.argv.slice(2);
const yargv = require('yargs').argv;

if (null == argv || argv == 0 || '--help' === argv[0]) {
    console.log('\n  使用: ibird (hot|deploy) 参数\n\n');
    console.log('  --help                     查看帮助\n');
    console.log('  -c arg                     指定ibird.config.js文件地址，绝对路径\n');
    console.log('  -d arg                     指定输出目录，绝对路径\n');
    process.exit(0);
}

//处理参数
const options = [argv[0]];
var config_path = yargv.config || yargv.c;
var dist_path = yargv.dist || yargv.d;
config_path = config_path && !path.isAbsolute(config_path) ? path.join(process.cwd(), config_path) : config_path;
dist_path = dist_path && !path.isAbsolute(dist_path) ? path.join(process.cwd(), dist_path) : dist_path;
if (config_path) options.push('--config', config_path);
if (dist_path) options.push('--dist', dist_path);

//调用gulp命令
exec('cd client && gulp '+options.join(' '), (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
});