/**
 * 表单工厂
 * 根据表单类型返回不同的表单
 * Created by yinfxs on 16-6-27.
 */

'use strict';

const FormUtils = require('./FormUtils');

module.exports = function (inputType, label, identifier, data) {
    let formGroup = null;
    switch (inputType) {
        case 'string':
            //文本框
            formGroup = FormUtils.string(label, identifier);
            break;
        case 'password':
            //密码框
            formGroup = FormUtils.password(label, identifier);
            break;
        case 'date':
            //日期
            formGroup = FormUtils.date(label, identifier);
            break;
        case 'time':
            //时间
            formGroup = FormUtils.time(label, identifier);
            break;
        case 'datetime':
            //日期时间
            formGroup = FormUtils.datetime(label, identifier);
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
            formGroup = FormUtils.number(label, identifier);
            break;
        case 'textarea':
            //编辑器
            formGroup = FormUtils.textarea(label, identifier);
            break;
        case 'ref':
            //单引用
            formGroup = FormUtils.ref(label, identifier);
            break;
        case 'refs':
            //多引用
            formGroup = FormUtils.refs(label, identifier);
            break;
        case 'file':
            //单文件/图片
            formGroup = FormUtils.file(label, identifier);
            break;
        case 'files':
            //多文件/图片
            formGroup = FormUtils.files(label, identifier);
            break;
        default:
            //文本框
            formGroup = FormUtils.string(label, identifier);
            break;
    }
    return formGroup;
};