/**
 * Created by yinfxs on 16-10-24.
 */
const uuid = require('node-uuid');
const ibird = require('ibird');
ibird.initialize({
    name: '应用管理后台',
    "config": {
        "mongodb": "mongodb://ibird:!QAZ2wsx@127.0.0.1:27017/ibird-demo"
    },
    modules: [
        {
            "label": "业务模块",
            "code": "business",
            "schemas": [
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
                        }
                    }
                }
            ]
        }
    ]
}).start();