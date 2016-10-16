/**
 * 文档生成模块
 * Created by yinfxs on 16-8-8.
 */
'use strict';

const _ = require('underscore');
const assign = require('object-assign');
const fs = require('fs');
const fsx = require('fs-extra');
const path = require('path');
const i18n = require('./i18n');
const utility = require('./utility');

var configs = {}, docsPath = '', ruprefix = '';

module.exports = function (c, p = '') {
    configs = c;
    ruprefix = p;
    docsPath = path.resolve(configs.public, 'docs');

    fsx.copySync(path.resolve(__dirname, '../docs'), docsPath);

    module.exports.model();//生成数据字典文档
    module.exports.api();//生成API文档
};

/**
 * 生成数据字典文档
 */
module.exports.model = function () {
    if (!configs) return;
    const modules = [];
    configs.modules.forEach(function (module) {
        let content = `
${module.label} ${module.code}
======`;
        module.schemas.forEach(function (schema) {
            content += '\n';
            content += `
${schema.label} ${schema.code}
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`;
            content = modelFields(schema, content);
        });
        content += '\n';
        modules.push(content);
    });
    fileTemplateReplace(path.resolve(__dirname, '../docs/model.md'), path.resolve(docsPath, 'model.md'), {content: modules.join('\n')});
};

/**
 * 生成模型属性
 * @param schema
 * @param content
 * @returns {*}
 */
function modelFields(schema, content) {
    Object.keys(schema.fields).forEach(function (key) {
        const field = schema.fields[key];
        if (!field) return;
        content += `
| ${key} | ${field.label || '暂无'} | ${_.isArray(field.type) == false ? field.type.name : field.type[0].name} | ${field.ctrltype || 'string'} | ${(field.required && field.required != false) ? true : false} | ${field.unique || false} | ${field.index || false} | ${field.default && _.isFunction(field.default) != true ? field.default : '暂无' } | ${_.isObject(field.items) ? JSON.stringify(field.items) : '暂无'} | ${field.ref || '暂无'} | ${field.refOptions ? field.refOptions.display : '暂无'} | ${field.refOptions ? field.refOptions.value.replace(new RegExp('\_', 'g'), '\\_') : '暂无'} |`;
    });
    return content;
}

/**
 * 生成API接口文档
 */
module.exports.api = function () {
    if (!configs) return;
    const modules = [];
    configs.modules.forEach(function (module) {
        let content = `
${module.label} ${module.code}
======`;
        content = apiModels(module, content);
        content = apiRoutes(module, content);
        modules.push(content);
    });
    fileTemplateReplace(path.resolve(__dirname, '../docs/api.md'), path.resolve(docsPath, 'api.md'), {content: modules.join('\n')});
};
/**
 * 生成指定模块下模型默认API接口文档
 * @param module
 * @param content
 */
function apiModels(module, content) {
    if (!module.schemas) return content;
    module.schemas.forEach(function (schema) {
        for (let i = 1; i < 6; i++) {
            const object = docObjectBySchema(module, schema, i);
            if (!object || !object.url) return;
            object.url = ruprefix + object.url;//添加接口前缀
            content = docContentByObject(object, content);
        }
    });
    return content;
}
/**
 * 生成指定模块下自定义的API接口文档
 * @param module
 * @param content
 */
function apiRoutes(module, content) {
    const routes = module.routes;
    const moduleCode = module.code;
    if (!routes || !_.keys(routes) || _.keys(routes).length == 0) return content;
    _.keys(routes).forEach(function (rule) {
        if (_.isFunction(routes[rule])) return;//默认GET请求，没有设置请求接口文档对象
        const item = routes[rule];//url下每一个接口对象，item是个对象，key为HTTP请求方式
        if (!item || !_.keys(item) || _.keys(item).length == 0) return;
        _.keys(item).forEach(function (method) {
            const doc = item[method].doc;
            if (!doc) return;
            if (doc.url) {
                doc.url = doc.url.startsWith('/' + moduleCode) ? doc.url : '/' + moduleCode + (doc.url.startsWith('/') ? doc.url : '/' + doc.url);
            } else {
                doc.url = '/' + moduleCode + (rule.startsWith('/') ? rule : '/' + rule);
            }
            doc.url = doc.url ? doc.url : rule;
            doc.url = ruprefix + doc.url;//添加接口前缀
            doc.method = doc.method ? doc.method : method;
            doc.req = _.isString(doc.req) ? doc.req : JSON.stringify(doc.req, null, 2);
            doc.res = _.isString(doc.res) ? doc.res : JSON.stringify(doc.res, null, 2);
            content = docContentByObject(doc, content);
        });
    });
    return content;
}

/**
 * 根据object生成content内容
 * @param object 接口文档信息对象
 * @param content 总文本
 * @returns {*}
 */
function docContentByObject(object, content) {
    //拼装content
//#### HTTP请求方式
//${object.method || 'GET'}
    content += `
${object.url} | ${object.method || 'GET'}
---------------
${object.description || '暂无'}

#### 支持格式
${object.formats || 'JSON'}
#### 备注
${object.others || '暂无'}
#### 请求参数
\`\`\` javascript
${object.req}
\`\`\`
#### 响应参数
\`\`\` javascript
${object.res}
\`\`\`
#### 调用示例
\`\`\` javascript
${object.example}
\`\`\`
`;
    return content;
}
/**
 * 根据schema生成文档描述对象
 * @param module 模块部分
 * @param schema 当前schema
 * @param 接口标识，分别为：1,2,3,4,5共五个数字，分别表示：新增,修改,删除,列表,详情操作
 */
function docObjectBySchema(module, schema, flag) {
    const doc = {
        'url': '接口地址',
        'description': '接口描述',
        'method': 'HTTP请求方式',
        'formats': '支持格式',
        'req': {},
        'res': {},
        'example': '调用示例',
        'others': '其他'
    };
    const param = docParamsBySchema(schema);
    switch (flag) {
        case 1:
            //增加
            doc.url = '/' + module.code + '/' + schema.code;
            doc.description = '[' + schema.label + '] 模型默认新增接口';
            doc.method = 'POST';
            doc.formats = 'JSON';
            doc.req = param;
            assign(doc.res, {_id: '57e2ac2e471795945455cc9d'}, param);
            doc.example = `curl -X POST -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"\n -d 'code=yinfxs&password=111&email=yinfxs@gmail.com' "http://localhost:3000/${module.code}/${schema.code}"`;
            doc.example += `\n————————————————————————————————————————————————————————————————————————————\n`;
            doc.example += JSON.stringify(doc.res, null, 2);
            break;
        case 2:
            //修改
            doc.url = '/' + module.code + '/' + schema.code;
            doc.description = schema.label + '模型默认修改接口';
            doc.method = 'PUT';
            doc.formats = 'JSON';
            doc.req = {
                "cond": {"_id": "57e2a90469e9d9d5524778c8"},
                "doc": param
            };
            doc.res = {
                "ok": 1,
                "nModified": 0,
                "n": 0
            };
            doc.example = `curl -X PUT -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"\n -H "Cache-Control: no-cache" -d '${JSON.stringify(doc.req)}' "http://localhost:3000/${module.code}/${schema.code}"`;
            doc.example += `\n————————————————————————————————————————————————————————————————————————————\n`;
            doc.example += JSON.stringify(doc.res, null, 2);
            break;
        case 3:
            //删除
            doc.url = '/' + module.code + '/' + schema.code;
            doc.description = schema.label + '模型默认删除接口';
            doc.method = 'DELETE';
            doc.formats = 'JSON';
            doc.req = {
                "_id": "57e2a90469e9d9d5524778c8"
            };
            doc.res = {
                "ok": 1,
                "n": 1
            };
            doc.example = `curl -X DELETE -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"\n -H "Cache-Control: no-cache" -d '${JSON.stringify(doc.req)}' "http://localhost:3000/${module.code}/${schema.code}"`;
            doc.example += `\n————————————————————————————————————————————————————————————————————————————\n`;
            doc.example += JSON.stringify(doc.res, null, 2);
            break;
        case 4:
            //列表
            doc.url = '/' + module.code + '/' + schema.code;
            doc.description = schema.label + '模型默认列表查询接口';
            doc.method = 'GET';
            doc.formats = 'JSON';
            doc.req = {
                "keyword": "查询关键字(模糊匹配所有字符串字段)",
                "flag": "0(分页查询，为默认值)|1(全部查询)",
                "page": "1(页码，从1开始)",
                "size": "20(每页记录数)",
                "sort": "-code(排序字段编码，减号表示逆序，无符号表示升序)"
            };
            doc.res = {
                "data": [
                    assign(doc.res, {_id: '57e2ac2e471795945455cc9d'}, param)
                ],
                "totalelements": "4(总记录数)",
                "flag": "0(是否分页，与传入参数一致)",
                "keyword": "当前查询关键字",
                "start": "1(开始记录数)",
                "end": "4(结束记录数)",
                "page": "1(当前页码)",
                "size": "20(当前每页条数)",
                "totalpages": "1(总页数)"
            };
            doc.example = `curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"\n -H "Cache-Control: no-cache" "http://localhost:3000/${module.code}/${schema.code}"`;
            doc.example += `\n————————————————————————————————————————————————————————————————————————————\n`;
            doc.example += JSON.stringify(doc.res, null, 2);
            break;
        case 5:
            //详情
            doc.url = '/' + module.code + '/' + schema.code + '/' + ':id';
            doc.description = schema.label + '模型默认详情查询接口';
            doc.method = 'GET';
            doc.formats = 'JSON';
            doc.req = {};
            assign(doc.res, {_id: '57e2ac2e471795945455cc9d'}, param);
            doc.example = `curl -X GET -H "Content-Type: application/json" -H "access_token: 84edff70-8014-11e6-9a22-ef95cc3c1a5b"\n -H "Cache-Control: no-cache" "http://localhost:3000/${module.code}/${schema.code}/57e2ae8db9a9f22d56f45cdf"`;
            doc.example += `\n————————————————————————————————————————————————————————————————————————————\n`;
            doc.example += JSON.stringify(doc.res, null, 2);
            break;
    }
    doc.req = JSON.stringify(doc.req, null, 2);
    doc.res = JSON.stringify(doc.res, null, 2);
    return doc;
}
/**
 * 生成模型的参数部分
 * @param schema
 * @returns {{}}
 */
function docParamsBySchema(schema) {
    const param = {};
    Object.keys(schema.fields).forEach(function (key) {
        const field = schema.fields[key];
        const type = (_.isArray(field.type) ? field.type[0].name : field.type.name);
        if (field.required) key = '*' + key;
        param[key] = type + ',' + (field.ctrltype == 'password' ? '密码' : field.label);
    });
    return param;
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
        return console.log(i18n.value('doc_template_error', [e.message]));
    }
    if (!data) return console.log(i18n.value('doc_template_error', [tplpath]));
    let content = data.toString();
    _.keys(vars).map(function (key) {
        if (!key) return;
        content = content.replace(new RegExp('\\${\\s*' + key + '\\s*}', 'g'), vars[key]);
    });
    try {
        fs.writeFileSync(destpath, content);
    } catch (e) {
        console.error(e);
    }
}