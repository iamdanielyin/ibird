/**
 * 编码工具模块
 * Created by yinfxs on 16-6-22.
 */
'use strict';

/**
 * base64编码
 * @param string utf8字符串
 * @param times 次数
 */
exports.encodeBase64 = function (string, times = 1) {
    if(!string) return null;
    for (let i = 0; i < times; i++) {
        string = new Buffer(string).toString('base64');
    }
    return string;
};
/**
 * base64解码
 * @param string base64字符串
 * @param times 次数
 */
exports.decodeBase64 = function (string, times = 1) {
    if(!string) return null;
    for (let i = 0; i < times; i++) {
        string = new Buffer(string, 'base64').toString();
    }
    return string;
};