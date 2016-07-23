#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var _ = require('underscore');
var optimist = require("optimist");
var argv = optimist.argv;

var configPath = (argv.c || argv.config) || path.resolve(process.cwd(), 'ibird.config.js');

/**
 * 程序退出回调处理
 */
function done() {
    process.exit(0);
}

//配置文件处理
if (fs.existsSync(configPath) != true) {
    console.log('ibird配置文件不存在！');
    done();
}

/**
 * 根据RouteCatcher.react.example.jsx和components替换RouteCatcher.react.jsx
 * @param components 组件声明（alias:path）
 */
function replaceRouteCatcher(components) {
    //获取${requires}和${cases}的值
    let $requires = '', $cases = '';
    _.keys(components).map(function (key) {
        let obliqueIndex = components[key].lastIndexOf('/');
        let pointIndex = components[key].lastIndexOf('.');
        if (obliqueIndex == -1 || pointIndex == -1) return;
        const comname = pointIndex > obliqueIndex ? components[key].substring(obliqueIndex + 1, pointIndex) : components[key].substring(obliqueIndex + 1);

        $requires += `const ${comname} = require('${key}');\n`;
        $cases += `
            case '${key}':
                content = <${comname} module={module} path={path} model={query.m} schema={schema} i={i}/>;
                break;
        `;
    });
    //替换RouteCatcher.react.jsx
    const tplpath = path.resolve(__dirname, '../client/src/components/RouteCatcher.react.jsx.example');
    const destpath = path.resolve(__dirname, '../client/src/components/RouteCatcher.react.jsx');
    fileTemplateReplace(tplpath, destpath, {'#requires': $requires, '#cases': $cases});
}

/**
 * 文件模板替换
 * @param tplpath 模板文件地址
 * @param destpath 模板文件地址
 * @param vars 变量内容对象
 */
function fileTemplateReplace(tplpath, destpath, vars) {
    let data;
    try {
        data = fs.readFileSync(tplpath);
    } catch (e) {
        return console.log('读取模板' + tplpath + '异常：' + e.message);
    }
    if (!data) return console.log('读取模板' + tplpath + '异常');
    let content = data.toString();
    _.keys(vars).map(function (key) {
        if (!key) return;
        content = content.replace(new RegExp(key, 'g'), vars[key]);
        // console.log(content);
    });
    fs.writeFileSync(destpath, content);
}

function webpackConfig(components) {
    var webpackConfig = require(path.resolve(__dirname, '../webpack.config.js'));
    //添加所有components到entry中
    webpackConfig.entry.components = _.values(components);
    //添加别名
    webpackConfig.resolve.alias = _.extend(webpackConfig.resolve.alias, components);
    return webpackConfig;
}

/**
 * 配置文件处理
 */
function config() {
    var data = require(configPath);
    var components = data.components || {};
    data.modules.map(function (module) {
        if (!module.components) return;
        components = _.extend(components, module.components);
    });
    //替换RouteCatcher.react.jsx
    replaceRouteCatcher(components);
    // process.env.NODE_ENV = 'production';
    webpack(webpackConfig(components), function (err, stats) {
        if (err) {
            console.log('编译失败：', err);
        } else {
            console.log('编译成功：', stats.toString());
        }
        done();
    });
}
config();