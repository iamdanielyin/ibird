/**
 * SQLServer配置信息
 * Created by yinfxs on 16-6-5.
 */


const sql = require('mssql');
const utility = require('../utility');
const i18n = require('../i18n');
const app = {};
const log = require('../log');
const logger = log(module);

var instance = null;//全局连接对象

exports = module.exports = app;

/**
 * 获取连接
 * @param config 连接信息
 * @returns {*}
 */
app.getConnection = function (config) {
    if (instance) return instance;
    return instance = new Promise(function (resolve, reject) {
        const conn = new sql.Connection(config, function (err) {
            if (err) {
                logger.error(i18n.value('mssql_error', [err]));
                instance = null;
                return reject(err);
            }
            logger.info(utility.time() + '：' + i18n.value('mssql_success'));
            return resolve(conn);
        });
    });
};

/**
 * 执行事务
 * @param command 执行的SQL命令
 * @param success 成功回调
 * @param error 异常回调
 */
app.transaction = function (command, success, error) {
    app.getConnection().then(function (conn) {
        const transaction = new sql.Transaction(conn);
        transaction.begin().then(function () {
            new sql.Request(transaction).query(command).then(function () {
                transaction.commit().then(success).catch(function (err) {
                    transaction.rollback().done(error(err));
                })
            }).catch(error);
        }).catch(error);
    }).catch(error);
};

/**
 * 执行命令
 * @param command 执行的SQL命令
 * @param success 成功回调
 * @param error 异常回调
 */
app.query = function (command, success, error) {
    app.getConnection().then(function (conn) {
        new sql.Request(conn).query(command).then(success).catch(error);
    }).catch(error);
};

/**
 * 执行bulk插入操作
 * @param table 表对象
 * @param success 成功回调
 * @param error 异常回调
 */
app.bulk = function (table, success, error) {
    app.getConnection().then(function (conn) {
        const transaction = new sql.Transaction(conn);
        transaction.begin().then(function () {
            new sql.Request(transaction).bulk(table).then(function (rowCount) {
                transaction.commit().then(function () {
                    success(rowCount);
                }).catch(function (err) {
                    transaction.rollback().done(error(err));
                })
            }).catch(error);
        }).catch(error);
    }).catch(error);
};