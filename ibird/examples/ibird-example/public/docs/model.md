# 文档介绍

1. 数据模型的概念类似于关系型系统中的表的概念，类似于面向对象思想中的类的概念，它主要用来描述参与到系统中的数据对象。
2. 为了快速理清系统中的数据模型，明确每一个数据模型的结构，现将系统中的数据模型字典开放如下。
3. 该文档按模块列举了系统内所有的数据模型，并对每个模型进行了详细地说明。
4. 具体包括每个模型的模型名称、模型编码、字段列表等信息。


预置模块 preset
======

用户档案 user
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _id | 暂无 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| code | 帐号 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| password | 密码 | String | password | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| email | 邮箱 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| roles | 分配角色 | String | boolean-checkbox | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| org | 所属机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| creater | 创建人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| modifier | 修改人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| created | 创建时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| modified | 修改时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | true | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |

机构档案 org
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _id | 机构标识 | String | string | false | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| code | 机构编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 机构名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| pid | 上级机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| org | 所属机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| creater | 创建人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| modifier | 修改人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| created | 创建时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| modified | 修改时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | true | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |

资源管理 resource
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _id | 暂无 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| code | 资源编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 资源名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| type | 资源类型 | String | boolean-radios | true | false | false | 2 | {"1":"系统维护","2":"主动维护"} | 暂无 | 暂无 | 暂无 |
| tag | 分组标识 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| org | 所属机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| creater | 创建人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| modifier | 修改人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| created | 创建时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| modified | 修改时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | true | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |

角色管理 role
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _id | 暂无 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| code | 角色编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 角色名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| scope | 数据范围 | String | boolean-radios | false | false | false | 1 | {"1":"个人","2":"本级","3":"本级及以下"} | 暂无 | 暂无 | 暂无 |
| resources | 关联资源 | String | boolean-checkbox | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| org | 所属机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| creater | 创建人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| modifier | 修改人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| created | 创建时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| modified | 修改时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | true | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |

测试模型 commdl
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| text | 文本框 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| password | 密码框 | String | password | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| date | 日期 | String | date | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| time | 时间 | String | time | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| datetime | 日期时间 | String | datetime | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| booleanRadios | 单选 | String | boolean-radios | false | false | false | a | 暂无 | 暂无 | 暂无 | 暂无 |
| booleanCheckbox | 多选 | String | boolean-checkbox | false | false | false | b,c | 暂无 | 暂无 | 暂无 | 暂无 |
| number | 数字 | Number | number | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| textarea | 大文本 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| editor | 编辑器 | String | editor | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ref | 单引用 | String | ref | false | false | false | 暂无 | 暂无 | preset-user | code | \_id |
| refs | 多引用 | String | refs | false | false | false | 暂无 | 暂无 | preset-user | code | \_id |
| file | 单文件/图片 | String | file | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| files | 多文件/图片 | String | files | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| org | 所属机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| creater | 创建人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| modifier | 修改人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| created | 创建时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| modified | 修改时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | true | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |


业务模块 business
======

部门 dept
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code | 编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | true | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
| org | 所属机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| creater | 创建人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| modifier | 修改人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| created | 创建时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| modified | 修改时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |

业务参数 param
---------------
| 字段编码 | 字段名称 | 字段类型 | 控件类型 | 是否必须 | 是否唯一 | 是否索引 | 默认值 | 可选项 | 引用模型 | 引用显示值 | 引用隐藏值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| code | 参数编码 | String | string | true | true | true | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| name | 参数名称 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| value | 参数值 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| remark | 备注 | String | textarea | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| ts | 时间戳 | String | string | false | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| dr | 删除标记 | String | boolean-radios | true | false | false | 0 | {"0":"否","1":"是"} | 暂无 | 暂无 | 暂无 |
| org | 所属机构 | String | ref | false | false | false | 暂无 | 暂无 | preset-org | name | \_id |
| creater | 创建人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| modifier | 修改人 | String | ref | true | false | false | ibird | 暂无 | preset-user | code | \_id |
| created | 创建时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
| modified | 修改时间 | String | string | true | false | false | 暂无 | 暂无 | 暂无 | 暂无 | 暂无 |
