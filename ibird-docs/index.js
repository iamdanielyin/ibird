'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const raml = require('ibird-raml');
const yaml = require('js-yaml');
const raml2html = require('raml2htmlfix');
const fs = require('fs');
const defaultTheme = raml2html.getConfigForTheme();
const path = require('path');
const app = {};

module.exports = app;

/**
 * 转换RAML文件或文档内容为JavaScript对象
 * @param path 文件路径
 * @param flag 是否为文件内容
 */
app.parse = (path, flag) => {
    if (!flag || flag === false) path = fs.readFileSync(path);
    try {
        return yaml.safeLoad(path);
    } catch (e) {
        console.log(e.message);
        return {};
    }
};

/**
 * 转换JavaScript对象为RAML内容
 * @param doc
 * @param file
 */
app.build = (doc, file) => {
    if (typeof doc !== 'object') return '';
    doc = yaml.safeDump(doc, {sortKeys: false, noCompatMode: true});
    if (!doc.startsWith('#%RAML 1.0')) doc = `#%RAML 1.0\n` + doc;
    if (file) fs.writeFileSync(file, doc);
    return doc;
};

/**
 * 根据RAML生成HTML
 * @param raml RAML文件路径或RAML内容
 * @param [html] HTML文件输出路径，可选
 */
app.html = async (raml, html) => {
    try {
        let result = await raml2html.render(raml, defaultTheme);
        // 替换为国内CDN
        result = result.replace(new RegExp(`https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css`, 'g'), 'https://cdn.bootcss.com/bootstrap/3.1.1/css/bootstrap.min.css');
        result = result.replace(new RegExp(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/styles/default.min.css`, 'g'), 'https://cdn.bootcss.com/highlight.js/9.3.0/styles/default.min.css');
        result = result.replace(new RegExp(`https://code.jquery.com/jquery-1.11.0.min.js`, 'g'), 'https://cdn.bootcss.com/jquery/1.11.0/jquery.min.js');
        result = result.replace(new RegExp(`https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js`, 'g'), 'https://cdn.bootcss.com/bootstrap/3.1.1/js/bootstrap.min.js');
        result = result.replace(new RegExp(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/highlight.min.js`, 'g'), 'https://cdn.bootcss.com/highlight.js/9.3.0/highlight.min.js');
        if (html) fs.writeFileSync(html, result);
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
};

/**
 * 根据ibird的配置对象生成相关文档
 * @param config ibird应用配置对象
 * @param [ramlpath] RAML文件保存路径，可选
 * @param [htmlpath] HTML文件保存路径，仅在ramlpath不为空的前提下可用
 */
app.gen = (config, ramlpath, htmlpath) => {
    if (!config) return;
    const doc = {
        title: config.name,
        baseUri: config.baseUri || `http://127.0.0.1:${config.port}`,
        mediaType: 'application/json',
        types: raml.modelTypes(config)
    };
    if (config.version) doc.version = config.version;
    raml.modelApis(doc, config);
    raml.routeApis(doc, config);

    const result = app.build(doc, ramlpath);
    return ramlpath && htmlpath ? app.html(ramlpath, htmlpath) : result;
};
