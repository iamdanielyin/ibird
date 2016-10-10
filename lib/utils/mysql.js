/**
 * MySQL配置信息
 * Created by yinfxs on 16-6-5.
 */


const mysql = require('mysql');
const utility = require('./utility');
const i18n = require('./i18n');

var instance = null;

/**
 * 初始化
 * @param config
 * @returns {*}
 */
module.exports = function (config) {
    if (instance) return instance;
    //MySQL连接初始化
    instance = mysql.createPool(config);
    instance.getConnection(function (err, connection) {
        if (err) return console.error(i18n.value('mssql_error', [err]));
        console.log(utility.time() + '：' + i18n.value('mysql_success'));
        connection.release();
    });
    return instance;
};
