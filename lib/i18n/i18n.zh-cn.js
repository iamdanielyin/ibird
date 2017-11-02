'use strict';


/**
 * 默认的简体中文配置
 * Created by yinfxs on 2017/4/8.
 */



module.exports = {
    app_name: 'ibird管理应用',
    mongo_config_error: config => `MongoDB配置异常：${config}`,
    mongo_start_error: message => `MongoDB连接异常：${message}`,
    mongo_start_success: time => `${time}：MongoDB连接成功！`,
    create_api_params_error: `参数不正确(name、obj)`,
    create_api_db_error: `新增数据异常`,
    api_model_nonexis: name => `模型不存在(${name})`,
    update_api_params_error1: `参数不正确(name)`,
    update_api_params_error2: `参数不正确(conditions、doc)`,
    update_api_db_error: `更新数据异常`,
    remove_api_params_error: `参数不正确(name、conditions)`,
    remove_api_db_error: `删除数据异常`,
    list_api_db_error: `列表查询异常`,
    list_api_params_error: `参数不正确(name、conditions)`,
    count_api_db_error: `计数查询异常`,
    count_api_params_error: `参数不正确(name、conditions)`,
    one_api_db_error: `单个查询异常`,
    one_api_params_error: `参数不正确(name、conditions)`,
    id_api_db_error: `ID查询异常`,
    id_api_params_error: `参数不正确(name、id)`
};