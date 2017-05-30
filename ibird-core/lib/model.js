'use strict';


/**
 * 模型部分内部接口
 * Created by yinfxs on 2017/4/5.
 */


const config = require('./config');
const utility = require('ibird-utils');
const i18n = require('./config').i18n;
const logger = require('./log')();

const app = {};

module.exports = app;

/**
 * 内部接口：创建模型
 * @param name 模型名称，与模型注册时一致
 * @param obj
 */
app.create = async (name, obj) => {
    if ((typeof name !== 'string') || (typeof obj !== 'object')) return Promise.reject(new Error(i18n.get('create_api_params_error')));
    const Model = config.model[name];
    if (!Model) return Promise.reject(new Error(i18n.get('api_model_nonexis', name)));

    const array = [];
    obj = Array.isArray(obj) ? obj : [obj];

    for (const item of obj) {
        if (!item) continue;
        array.push(new Model(item));
    }

    try {
        return (array.length === 1) ? array[0].save() : Model.create(array);
    } catch (e) {
        return Promise.reject(utility.errors(e, i18n.get('create_api_db_error')));
    }
};

/**
 * 内部接口：更新模型
 * @param name 模型名称，与模型注册时一致
 * @param conditions 更新条件
 * @param doc 需要更新文档对象
 * @param [options]
 */
app.update = async (name, conditions, doc, options) => {
    if (typeof name !== 'string') return Promise.reject(new Error(i18n.get('update_api_params_error1')));
    if ((typeof conditions !== 'object') || (typeof doc !== 'object')) return Promise.reject(new Error(i18n.get('update_api_params_error2')));
    const Model = config.model[name];
    if (!Model) return Promise.reject(new Error(i18n.get('api_model_nonexis', name)));

    try {
        return Model.update(conditions, doc, options);
    } catch (e) {
        return Promise.reject(utility.errors(e, i18n.get('update_api_db_error')));
    }
};

/**
 * 内部接口：删除模型
 * @param name 模型名称，与模型注册时一致
 * @param conditions 更新条件
 */
app.remove = async (name, conditions) => {
    if ((typeof name !== 'string') || (typeof conditions !== 'object')) return Promise.reject(new Error(i18n.get('remove_api_params_error')));
    const Model = config.model[name];
    if (!Model) return Promise.reject(new Error(i18n.get('api_model_nonexis', name)));

    try {
        return Model.remove(conditions);
    } catch (e) {
        return Promise.reject(utility.errors(e, i18n.get('remove_api_db_error')));
    }
};

/**
 * 内部接口：列表查询
 * @param name 模型名称，与模型注册时一致
 * @param conditions 查询条件
 * @param [callback] 针对查询对象回调处理函数
 * @param [options] 可选
 */
app.list = async (name, conditions, callback, options) => {
    if ((typeof name !== 'string') || (typeof conditions !== 'object')) return Promise.reject(new Error(i18n.get('list_api_params_error')));
    const Model = config.model[name];
    if (!Model) return Promise.reject(new Error(i18n.get('api_model_nonexis', name)));

    try {
        const query = Model.find(conditions, null, options);
        if (typeof callback === 'function') await callback(query);
        return query.exec();
    } catch (e) {
        return Promise.reject(utility.errors(e, i18n.get('list_api_db_error')));
    }
};

/**
 * 内部接口：查询指定查询条件数量
 * @param name 模型名称，与模型注册时一致
 * @param conditions 查询条件
 * @returns {*}
 */
app.count = async (name, conditions) => {
    if ((typeof name !== 'string') || (typeof conditions !== 'object')) return Promise.reject(new Error(i18n.get('count_api_params_error')));
    const Model = config.model[name];
    if (!Model) return Promise.reject(new Error(i18n.get('api_model_nonexis', name)));

    try {
        return Model.count();
    } catch (e) {
        return Promise.reject(utility.errors(e, i18n.get('count_api_db_error')));
    }
};

/**
 * 内部接口：单个查询
 * @param name 模型名称，与模型注册时一致
 * @param conditions 查询条件
 * @param [callback] 针对查询对象回调处理函数
 * @param [options] 可选
 */
app.one = async (name, conditions, callback, options) => {
    if ((typeof name !== 'string') || (typeof conditions !== 'object')) return Promise.reject(new Error(i18n.get('one_api_params_error')));
    const Model = config.model[name];
    if (!Model) return Promise.reject(new Error(i18n.get('api_model_nonexis', name)));

    try {
        const query = Model.findOne(conditions, null, options);
        if (typeof callback === 'function') await callback(query);
        return query.exec();
    } catch (e) {
        return Promise.reject(utility.errors(e, i18n.get('one_api_db_error')));
    }
};
/**
 * 内部接口：ID查询
 * @param name 模型名称，与模型注册时一致
 * @param id 查询条件
 * @param [callback] 针对查询对象回调处理函数
 * @param [options] 可选
 */
app.id = async (name, id, callback, options) => {
    if ((typeof name !== 'string') || (typeof id !== 'string')) return Promise.reject(new Error(i18n.get('id_api_params_error')));
    const Model = config.model[name];
    if (!Model) return Promise.reject(new Error(i18n.get('api_model_nonexis', name)));

    try {
        const query = Model.findById(id, null, options);
        if (typeof callback === 'function') await callback(query);
        return query.exec();
    } catch (e) {
        return Promise.reject(utility.errors(e, i18n.get('id_api_db_error')));
    }
};