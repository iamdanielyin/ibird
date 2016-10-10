/**
 * MongoDB配置信息
 * Created by yinfxs on 16-6-5.
 */


const mongoose = require('mongoose');
const utility = require('./utility');
const i18n = require('./i18n');
mongoose.Promise = global.Promise;//指定Mongoose使用本地Promise

/**
 * 初始化
 * @param constr
 * @returns {*}
 */
module.exports = function (constr) {
    //MongoDB连接初始化
    mongoose.connect(constr, function (err) {
        if (err) return console.error(i18n.value('mongodb_error', [err]));
        console.log(utility.time() + '：' + i18n.value('mongodb_success'));
    });
};
