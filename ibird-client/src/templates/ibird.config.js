/**
 * ibird配置文件
 * Created by yinfxs on 16-10-11.
 */

'use strict';

const path = require('path');
const uuid = require('uuid');
const React = require('react');

module.exports = {
    ctrltypes: {
        'subema2': {
            init: (ctx) => {
                return (
                    <div className="form-group" key={uuid.v4()}></div>
                );
            },
            onload: (ctx) => {
                //加载组件
            },
            validate: (ctx) => {
                //验证
            },
            setValue: (ctx) => {
                //设置值
            },
            getValue: (ctx) => {
                //获取值
            }
        }
    }
};