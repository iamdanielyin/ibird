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
const runSequence = require('run-sequence');


// 服务端构建任务
gulp.task('server', function () {
    return gulp.src('lib/**/*.js')      //引入所有需处理的JS
        .pipe(babel({presets: ['es2015']}))//babel转换ES2015语法
        .pipe(jshint())
        .pipe(jshint.reporter('default'))         //JS代码检查
        .pipe(gulp.dest('./dist/lib'));        //构建后输出
});

// 服务端构建任务
gulp.task('server:index', function () {
    return gulp.src('index.js')      //引入所有需处理的JS
        .pipe(babel({presets: ['es2015']}))//babel转换ES2015语法
        .pipe(jshint())
        .pipe(jshint.reporter('default'))         //JS代码检查
        .pipe(gulp.dest('./dist/'));        //构建后输出
});

// 输出目录清理任务
gulp.task('clean', function () {
    return gulp.src(['./dist'], {read: false})
        .pipe(clean());
});
// 注册编译任务
gulp.task('build', function () {
    runSequence('clien', 'server', 'server:index');
});


// 文档临听任务
gulp.task('watch', ['build'], function () {
    gulp.watch('lib/**/*.js', ['server']);//监听服务端
    gulp.watch('index.js', ['server:index']);//监听服务端
});

// 注册默认任务
gulp.task('default', function () {
    runSequence('clean', 'build');
});
