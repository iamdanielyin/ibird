/**
 * 文件上传中间件
 * Created by yinfxs on 16-6-7.
 */
const i18n = require('../utils/i18n');
const multipart = require('connect-multiparty');

let instance = null;
module.exports = function (publicDir) {
    if (!instance || publicDir) instance = multipart({uploadDir: publicDir});
    return instance;
};