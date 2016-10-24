# 文档介绍

Backbone.js gives structure to web applications by providing models with 
key-value binding and custom events, collections with a rich API of enumerable 
functions, views with declarative event handling, and connects it all to your 
existing API over a RESTful JSON interface.

The project is hosted on GitHub, and the annotated source code is available, as well as an online test suite, an example application, a list of tutorials and a long list of real-world projects that use Backbone. Backbone is available for use under the MIT software license.

You can report bugs and discuss features on the GitHub issues page, on Freenode IRC in the #documentcloud channel, post questions to the Google Group, add pages to the wiki or send tweets to @documentcloud.

Backbone is an open-source component of DocumentCloud.

Here, I try to document the good practices that our team has learned along the
way building [Backbone][bb] applications.

This document assumes that you already have some knowledge of [Backbone.js][bb],
[jQuery][jq], and of course, JavaScript itself.

[rsc]: http://ricostacruz.com/
[bb]: http://documentcloud.github.com/backbone/
[jq]: http://jquery.com/


预置模块 preset
======

系统用户 user
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code | 编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| password | 暂无 | String | password | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| email | 邮箱 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | false | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |

系统参数 param
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code | 参数编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 参数名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| value | 参数值 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | false | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |

令牌管理 token
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| access_token | 访问token | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| refresh_token | 更新token | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| expires_in_access | 访问token有效秒数 | Number | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| expires_in_refresh | 刷新token有效秒数 | Number | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| data | 额外数据 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| update_ts | 更新时间 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | false | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |

测试模型 commdl
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| text | 文本框 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| password | 密码框 | String | password | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| date | 日期 | String | date | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| time | 时间 | String | time | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| datetime | 日期时间 | String | datetime | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| booleanRadios | 单选 | String | boolean-radios | false | false | false | a | 暂无 | 暂无 | 暂无 | 暂无 |
| booleanCheckbox | 多选 | String | boolean-checkbox | false | false | false | b,c | 暂无 | 暂无 | 暂无 | 暂无 |
| number | 数字 | Number | number | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| textarea | 大文本 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ref | 单引用 | String | ref | false | false | false | 暂无 | 暂无 | preset-user | code | \_id |
| refs | 多引用 | String | refs | false | false | false | 暂无 | 暂无 | preset-user | code | \_id |
| refs2 | 多引用2 | String | refs | false | false | false | 暂无 | 暂无 | preset-user | code | \_id |
| refs3 | 多引用3 | String | refs | false | false | false | 暂无 | 暂无 | preset-user | code | \_id |
| file | 单文件/图片 | String | file | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| files | 多文件/图片 | String | files | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |


业务模块 business
======

部门 dept
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code | 编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | false | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |

业务参数 param
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code | 参数编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 参数名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| value | 参数值 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | false | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
