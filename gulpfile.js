/**
 * Gulp构建脚本
 * @author yinfxs
 * @time 2016-05-26 11:08:16
 */

'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');


// 服务端构建任务
gulp.task('server', function () {
    return gulp.src('lib/**/*.js')      //引入所有需处理的JS
        .pipe(babel({presets: ['es2015']}))//babel转换ES2015语法
        .pipe(jshint.reporter('default'))         //JS代码检查
        .pipe(gulp.dest('./dist/lib'));        //构建后输出
});

// 服务端构建任务
gulp.task('server:index', function () {
    return gulp.src('index.js')      //引入所有需处理的JS
        .pipe(babel({presets: ['es2015']}))//babel转换ES2015语法
        .pipe(jshint.reporter('default'))         //JS代码检查
        .pipe(gulp.dest('./dist/'));        //构建后输出
});

// 服务端构建任务
gulp.task('server:others', function () {
    return gulp.src(['package.json'/*,'usage.js'*/])      //引入所有需处理的JS
        .pipe(gulp.dest('./dist/'));        //构建后输出
});

// 前端图片处理任务
gulp.task('client:images', function () {
    return gulp.src('client/dist/**/*.(png|jpg|jpeg)')        //引入所有需处理的图片文件
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))      //压缩图片
        .pipe(gulp.dest('./dist/client/')); //输出压缩后的图片
});

// 前端模块处理任务
gulp.task('client:scripts', function () {
    return gulp.src('client/dist/**/*.+(js|jsx)')      //引入所有需处理的JS和JSX文件
        .pipe(gulp.dest('./dist/client/'));        //输出压缩后的文件
});

// 前端网页压缩处理任务
gulp.task('client:htmls', function () {
    return gulp.src('client/dist/*.html')    //引入所有前端网页文件
        .pipe(htmlmin({collapseWhitespace: true}))           //压缩网页文件
        .pipe(gulp.dest('./dist/client/'));      //输出压缩后的文件
});

// 前端模块处理任务
gulp.task('client:others', function () {
    return gulp.src('client/dist/**/*')      //引入所有需处理的JS和JSX文件
        .pipe(gulp.dest('./dist/client/'));        //输出压缩后的文件
});

// 输出目录清理任务
gulp.task('clean', function () {
    return gulp.src(['./dist'], {read: false})
        .pipe(clean());
});

// 输出目录清理任务
gulp.task('client:clean', function () {
    return gulp.src(['./client/build', './client/dist'], {read: false})
        .pipe(clean());
});

// 注册编译任务
gulp.task('build', function () {
    runSequence('server', 'server:index', 'server:others', 'client:others', 'client:images', 'client:scripts', 'client:htmls');
});

// 注册默认任务
gulp.task('default', function () {
    runSequence('clean', 'build');
});
