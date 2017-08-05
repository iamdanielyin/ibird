'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const raml = require('ibird-raml');
const utility = require('ibird-utils');
const fsx = require('fs-extra');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const app = { custom: {} };

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
    doc = yaml.safeDump(doc, { sortKeys: false, noCompatMode: true });
    if (!doc.startsWith('#%RAML 1.0')) doc = `#%RAML 1.0\n` + doc;
    if (file) fs.writeFileSync(file, doc);
    return doc;
};

/**
 * 添加自定义的接口定义
 * @param object 文档描述对象
 */
app.add = (object) => {
    if (Array.isArray(object) && object.length > 0) {
        for (const item of object) {
            app.add(item);
        }
        return app.custom;
    }
    if (typeof object !== 'object' || Object.keys(object).length === 0) return app.custom;
    utility.assign(app.custom, object);
    return app.custom;
};

/**
 * 检测资源文件是否存在
 * @param {*} filePath 
 */
function ensureAssetsExists(filePath) {
    if (!filePath) return;
    try {
        const parse = path.parse(filePath);
        if (!parse || !parse.dir) return;
        const dirExists = fsx.existsSync(parse.dir);
        if (!dirExists) {
            return fsx.copySync(path.resolve(__dirname, 'assets'), parse.dir);
        }
        const fileExists = fsx.existsSync(path.join(parse.dir, 'index.html'));
        if (fileExists) return;
        fsx.copySync(path.resolve(__dirname, 'assets'), parse.dir);
    } catch (error) {
        return;
    }
}

/**
 * 根据ibird的配置对象生成相关文档
 * @param config ibird应用配置对象
 * @param [raml] RAML文件保存路径，可选
 * @param [object] 文档配置对象
 * @param [ensureAssets] 检测api-console相关资源文件
 */
app.gen = ({ config, raml, object, ensureAssets = false }) => {
    if (!config) return;
    if (ensureAssets) ensureAssetsExists(raml);
    object = (typeof object === 'object') ? object : {
        securedBy: ['oauth_2_0'],
        securitySchemes: {
            oauth_2_0: {
                type: 'OAuth 2.0',
                settings: {
                    accessTokenUri: `${config.baseUri}${config.prefix}/token`,
                    authorizationGrants: ['password']
                }
            }
        }
    };
    const doc = utility.assign({
        title: config.name,
        baseUri: config.baseUri || `http://127.0.0.1:${config.port}`,
        mediaType: 'application/json',
        types: raml.modelTypes(config)
    }, object);
    if (config.version) doc.version = config.version;
    utility.assign(doc, app.custom);
    raml.modelApis(doc, config);
    const result = app.build(doc, ramlpath);
    return result;
};
