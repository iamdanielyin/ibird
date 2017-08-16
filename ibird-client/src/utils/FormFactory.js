/**
 * 表单工厂
 * 根据表单类型返回不同的表单
 * Created by yinfxs on 16-6-27.
 */

'use strict';

const FormUtils = require('./FormUtils');
const app = {};

module.exports = app;

app.get = (ctrltype, label, identifier, data) => {
    let formGroup = null;
    switch (ctrltype) {
        case 'string':
            //文本框
            formGroup = FormUtils.string(label, identifier, data);
            break;
        case 'password':
            //密码框
            formGroup = FormUtils.password(label, identifier, data);
            break;
        case 'date':
            //日期
            formGroup = FormUtils.date(label, identifier, data);
            break;
        case 'time':
            //时间
            formGroup = FormUtils.time(label, identifier, data);
            break;
        case 'datetime':
            //日期时间
            formGroup = FormUtils.datetime(label, identifier, data);
            break;
        case 'boolean-radios':
            //单选
            formGroup = FormUtils['boolean-radios'](label, identifier, data);
            break;
        case 'boolean-checkbox':
            //多选
            formGroup = FormUtils['boolean-checkbox'](label, identifier, data);
            break;
        case 'number':
            //数字
            formGroup = FormUtils.number(label, identifier, data);
            break;
        case 'textarea':
            //大文本
            formGroup = FormUtils.textarea(label, identifier, data);
            break;
        case 'editor':
            //编辑器
            formGroup = FormUtils.editor(label, identifier, data);
            break;
        case 'ref':
            //单引用
            formGroup = FormUtils.ref(label, identifier, data);
            break;
        case 'refs':
            //多引用
            formGroup = FormUtils.refs(label, identifier, data);
            break;
        case 'file':
            //单文件/图片
            formGroup = FormUtils.file(label, identifier, data);
            break;
        case 'files':
            //多文件/图片
            formGroup = FormUtils.files(label, identifier, data);
            break;
        default:
            //文本框
            formGroup = FormUtils.string(label, identifier, data);
            break;
    }
    return formGroup;
};