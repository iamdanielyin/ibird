/**
 * 业务模块
 * Created by yinfxs on 16-8-6.
 */
const uuid = require('node-uuid');
const _ = require('lodash');
const moment = require('moment');
moment.locale('zh-cn');

module.exports = function (ibird) {
    return {
        "label": "业务模块",
        "code": "business",//模块编码不能重复且不能有下划线
        "schemas": [
            {
                "code": "dept",
                "label": "部门",
                "partsauth": true,
                "fields": {
                    code: {
                        type: String,
                        label: "编码",
                        unique: true,
                        required: "编码({PATH})不能为空",
                        index: true,
                        default: function () {
                            return uuid.v1();
                        }
                    },
                    name: {
                        type: String,
                        label: "名称",
                        required: "名称({PATH})不能为空"
                    },
                    remark: {
                        type: String,
                        label: "备注"
                    },
                    ts: {
                        type: String,
                        label: "时间戳",
                        default: function () {
                            return moment().format('x');
                        }
                    },
                    dr: {
                        type: String,
                        label: "删除标记",
                        ctrltype: 'boolean-radios', items: {
                            '0': '否', '1': '是'
                        },
                        default: '0'
                    }
                },
                "options": {},
                "customSchema": function (schema) {
                    return schema;
                }
            },
            {
                "code": "param",
                "label": "业务参数",
                "fields": {
                    code: {
                        type: String,
                        label: "参数编码",
                        unique: true,
                        required: "编码({PATH})不能为空",
                        index: true,
                        default: function () {
                            return uuid.v1();
                        }
                    },
                    name: {
                        type: String,
                        label: "参数名称",
                        required: "名称({PATH})不能为空"
                    },
                    value: {
                        type: String,
                        label: "参数值",
                        required: "参数值({PATH})不能为空"
                    },
                    remark: {
                        type: String,
                        label: "备注"
                    },
                    ts: {
                        type: String,
                        label: "时间戳",
                        default: function () {
                            return moment().format('x');
                        }
                    },
                    dr: {
                        type: String,
                        label: "删除标记",
                        ctrltype: 'boolean-radios', items: {
                            '0': '否', '1': '是'
                        },
                        default: '0'
                    }
                },
                "options": {},
                "customSchema": function (schema) {
                    return schema;
                }
            }
        ],
        "routes": {}
    }
};