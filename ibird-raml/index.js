'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const app = {};

module.exports = app;

/**
 * 转换数据模型的数据类型为对应的RAML类型
 * @param instance
 * @returns {*}
 */
const typeChange = (instance) => {
    switch (instance) {
        case 'ObjectID':
            return 'string';
        case 'Date':
            return 'datetime';
        case 'Buffer':
            return 'file';
        case 'Mixed':
            return 'any';
        default:
            return instance.toLowerCase();
    }
};

/**
 * 处理单个数据模型的转换
 * @param schema
 * @returns {{type: string, properties: {}}}
 */
app.modelType = (schema) => {
    schema = schema.schema || schema;
    const object = { type: 'object', properties: {} };
    const paths = schema.paths;
    for (const key in schema.paths) {
        const v = schema.paths[key];
        const property = {};
        property.type = typeChange(v.instance);
        property.required = v.isRequired || false;

        if (v.options.ref) property.type = v.options.ref;
        if (v.options.description) property.description = v.options.description;
        if (v.options.example) property.example = v.options.example;
        if (v.options.datetype && instance === 'Date') property.type = v.options.datetype;
        if (v.defaultValue !== null && v.defaultValue !== undefined && (typeof v.defaultValue !== 'function')) property.default = v.defaultValue;
        if (v.options.displayName) property.displayName = v.options.displayName;
        if (v.enumValues && v.enumValues.length > 0) property.enum = v.enumValues;
        if (property.type === 'array' && v.$isMongooseDocumentArray === true) property.items = app.modelType(v.schema);
        if (v.validators && v.validators.length > 0) {
            if (v.validators.type) property.type = v.options.datetype;
            for (let validator of v.validators) {
                switch (v.instance) {
                    case 'Number':
                        if (validator.type === 'min') property.minimum = validator.min;
                        if (validator.type === 'max') property.maximum = validator.max;
                        break;
                }
            }
        }
        object.properties[v.path] = property;
    }
    return object;
};

/**
 * 处理多个模型的转换，根据ibird的配置对象生成RAML文档的types部分
 * @param config
 * @returns {{}}
 */
app.modelTypes = (config) => {
    const result = {};
    for (const code in config.schema) {
        let s = config.schema[code];
        if (s === null || (typeof s !== 'object')) continue;
        result[code] = app.modelType(s);
    }
    return result;
};

/**
 * 根据ibird的配置对象生成RAML文档的模型默认API部分
 * @param doc
 * @param config
 * @param filters
 * @returns {{}}
 */
app.modelApis = (doc, config, filters = {}) => {
    if (doc && !config) {
        config = doc;
        doc = {};
    } else if (!doc && config) {
        doc = {};
    }
    for (const code in config.schema) {
        if (!code) continue;
        let s = config.schema[code];
        if (s === null || (typeof s !== 'object')) continue;
        app.modelApi(doc, s, config.prefix, Array.isArray(filters) ? filters : filters.code);
    }
    return doc;
};

/**
 * 获取对象中的指定值
 * @param object
 * @param filters
 */
function pick(object, filters) {
    if (typeof object !== 'object' || !Array.isArray(filters)) return {};
    const result = {};
    for (const key in object) {
        if (filters.indexOf(key) < 0) continue;
        Object.assign(result, object[key]);
    }
    return result;
}

/**
 * 根据ibird的配置对象生成单个数据模型的默认API部分
 * @param doc 文档对象
 * @param conf 单个数据模型的配置部分
 * @param prefix 接口全局前缀
 * @param filters 指定需要生成的接口['list', 'one', 'id', 'create', 'delete', 'update']
 * @returns {*}
 */
app.modelApi = (doc, conf, prefix, filters = ['list', 'one', 'id', 'create', 'delete', 'update']) => {
    const { name, displayName } = conf;
    let key = prefix ? `${prefix}/${name.toLowerCase()}` : name.toLowerCase();
    key = key.startsWith('/') ? key : `/${key}`;

    const object = {
        list: { get: app.modelListApi(name, displayName) },
        create: { post: app.modelCreateApi(name, displayName) },
        update: { put: app.modelUpdateApi(name, displayName) },
        delete: { delete: app.modelRemoveApi(name, displayName) }
    };
    doc[`${key}`] = pick(object, filters);

    if (filters.indexOf('one') >= 0) {
        doc[`${key}/one`] = {
            get: app.modelOneApi(name, displayName)
        };
    }
    if (filters.indexOf('id') >= 0) {
        doc[`${key}/{id}`] = {
            get: app.modelIdApi(name, displayName)
        };
    }
    return doc;
};

/**
 * 生成模型的列表查询接口
 * @param name 模型名称
 * @param displayName 显示名
 * @returns
 */
app.modelListApi = (name, displayName) => {
    return {
        displayName: `查询${displayName || name}`,
        description: `查询${displayName || name}列表接口`,
        queryParameters: {
            range: {
                displayName: '查询模式',
                description: '查询模式，全部查询（ALL）或分页查询（PAGE）',
                type: 'string',
                required: false,
                default: 'PAGE',
                example: 'PAGE',
                enum: ['PAGE', 'ALL']
            },
            page: {
                displayName: '页码',
                description: '用于在分页查询时，指定当前页的页码值，计数从1开始',
                type: 'integer',
                required: false,
                default: 1,
                example: 1,
                minimum: 1
            },
            size: {
                displayName: '每页条数',
                description: '用于在分页查询时，指定每页条数',
                type: 'integer',
                required: false,
                default: 20,
                example: 20,
                minimum: 1
            },
            sort: {
                displayName: '排序字符串',
                description: '用于指定当前查询的排序字段，可指定模型中的任意字段，顺序排列时直接指定字段，逆序时以负号（-）开头，支持多重排序，多个字段间以英文空格分隔',
                type: 'string',
                required: false,
                default: '-created -updated code _id',
                example: '_id'
            },
            cond: {
                displayName: '查询条件',
                description: '用于指定查询条件，需为JSON的字符串格式。接口调用者需要先使用模型中定义的任意字段组成JSON对象，然后将此JSON格式化为字符串类型，再指定到该参数处，详见Mongoose的find查询条件',
                type: 'string',
                required: false,
                default: '{}',
                example: `{}`
            }
        },
        responses: {
            200: {
                body: {
                    type: 'object',
                    properties: {
                        data: {
                            displayName: '返回数据',
                            description: '接口返回的数据部分',
                            type: 'object',
                            properties: {
                                list: {
                                    displayName: '列表数据',
                                    description: '返回查询出的列表数据',
                                    type: 'array',
                                    items: {
                                        type: `${name}`,
                                        properties: {
                                            __v: {
                                                displayName: '版本',
                                                description: '默认生成的版本字段',
                                                type: 'integer',
                                                required: true,
                                                default: 0,
                                                example: 0
                                            },
                                            _id: {
                                                displayName: '数据ID',
                                                description: '默认生成的ID字段',
                                                type: 'string',
                                                required: true,
                                                example: '58ff71aeed56765aff6ea878'
                                            }
                                        }
                                    },
                                    required: true,
                                    default: []
                                },
                                totalrecords: {
                                    displayName: '总记录数',
                                    description: '当前查询数据的总记录数',
                                    type: 'integer',
                                    required: true,
                                    default: 0,
                                    example: 30,
                                    minimum: 0
                                },
                                totalpages: {
                                    displayName: '总页数',
                                    description: '分页查询时的最大页码数',
                                    type: 'integer',
                                    required: true,
                                    default: 1,
                                    example: 5,
                                    minimum: 1
                                },
                                range: {
                                    displayName: '查询模式',
                                    description: '返回查询时指定的查询模式，全部查询（ALL）或分页查询（PAGE）',
                                    type: 'string',
                                    required: true,
                                    default: 'PAGE',
                                    example: 'PAGE',
                                    enum: ['PAGE', 'ALL']
                                },
                                page: {
                                    displayName: '页码',
                                    description: '返回查询时指定的页码，表示当前页的页码值，计数从1开始',
                                    type: 'integer',
                                    required: false,
                                    default: 1,
                                    example: 1,
                                    minimum: 1
                                },
                                size: {
                                    displayName: '每页条数',
                                    description: '返回查询时指定的每页条数',
                                    type: 'integer',
                                    required: false,
                                    default: 20,
                                    example: 20,
                                    minimum: 1
                                },
                                sort: {
                                    displayName: '排序字符串',
                                    description: '返回查询时指定的排序字符串',
                                    type: 'string',
                                    required: true,
                                    default: '-created -updated code _id',
                                    example: '_id'
                                },
                                cond: {
                                    displayName: '查询条件',
                                    description: '返回查询时指定的查询条件的对象格式',
                                    type: 'object',
                                    required: true,
                                    default: {},
                                    example: { 'code': 'A101', 'name': '商品名称' }
                                }
                            }
                        },
                        errmsg: {
                            displayName: '错误信息',
                            description: '当调用接口异常时返回的错误描述信息，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '参数不能为空'
                        },
                        errcode: {
                            displayName: '错误代码',
                            description: '当调用接口异常时返回的错误代码，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '500'
                        }
                    }
                }
            }
        }
    };
};

/**
 * 生成模型的单个查询接口
 * @param name
 * @param displayName
 * @returns
 */
app.modelOneApi = (name, displayName) => {
    return {
        displayName: `查询单个${displayName || name}`,
        description: `查询单个${displayName || name}接口`,
        queryParameters: {
            cond: {
                displayName: '查询条件',
                description: '用于指定查询条件，需为JSON的字符串格式。接口调用者需要先使用模型中定义的任意字段组成JSON对象，然后将此JSON格式化为字符串类型，再指定到该参数处，详见Mongoose的find查询条件',
                type: 'string',
                required: false,
                default: '{}',
                example: `{}`
            }
        },
        responses: {
            200: {
                body: {
                    type: 'object',
                    properties: {
                        data: {
                            displayName: '返回数据',
                            description: '接口返回的数据部分',
                            type: `${name}`
                        },
                        errmsg: {
                            displayName: '错误信息',
                            description: '当调用接口异常时返回的错误描述信息，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '参数不能为空'
                        },
                        errcode: {
                            displayName: '错误代码',
                            description: '当调用接口异常时返回的错误代码，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '500'
                        }
                    }
                }
            }
        }
    };
};

/**
 * 生成模型的ID查询接口
 * @param name
 * @param displayName
 * @returns
 */
app.modelIdApi = (name, displayName) => {
    return {
        displayName: `根据ID查询${displayName || name}`,
        description: `根据ID查询${displayName || name}接口`,
        responses: {
            200: {
                body: {
                    type: 'object',
                    properties: {
                        data: {
                            displayName: '返回数据',
                            description: '接口返回的数据部分',
                            type: `${name}`
                        },
                        errmsg: {
                            displayName: '错误信息',
                            description: '当调用接口异常时返回的错误描述信息，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '参数不能为空'
                        },
                        errcode: {
                            displayName: '错误代码',
                            description: '当调用接口异常时返回的错误代码，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '500'
                        }
                    }
                }
            }
        }
    };
};

/**
 * 生成模型的新增接口
 * @param name
 * @param displayName
 * @returns
 */
app.modelCreateApi = (name, displayName) => {
    return {
        displayName: `新增${displayName || name}`,
        description: `新增${displayName || name}接口`,
        body: {
            type: `${name}`
        },
        responses: {
            200: {
                body: {
                    type: 'object',
                    properties: {
                        data: {
                            displayName: '返回数据',
                            description: '接口返回的数据部分',
                            type: 'array',
                            items: {
                                type: `${name}`,
                                properties: {
                                    __v: {
                                        displayName: '版本',
                                        description: '默认生成的版本字段',
                                        type: 'integer',
                                        required: true,
                                        default: 0,
                                        example: 0
                                    },
                                    _id: {
                                        displayName: '数据ID',
                                        description: '默认生成的ID字段',
                                        type: 'string',
                                        required: true,
                                        example: '58ff71aeed56765aff6ea878'
                                    }
                                }
                            }
                        },
                        errmsg: {
                            displayName: '错误信息',
                            description: '当调用接口异常时返回的错误描述信息，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '参数不能为空'
                        },
                        errcode: {
                            displayName: '错误代码',
                            description: '当调用接口异常时返回的错误代码，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '500'
                        }
                    }
                }
            }
        }
    };
};

/**
 * 生成模型的修改接口
 * @param name
 * @param displayName
 * @returns
 */
app.modelUpdateApi = (name, displayName) => {
    return {
        displayName: `修改${displayName || name}`,
        description: `修改${displayName || name}接口`,
        body: {
            type: `object`,
            properties: {
                cond: {
                    displayName: '更新条件',
                    description: '设置需要更新的文档所满足的条件，可使用模型字段所组成JSON对象，详见mongoose的Model.update接口中所指定的"conditions"参数',
                    type: `${name}`
                },
                doc: {
                    displayName: '需要更新的部分',
                    description: '设置需要更新的数据部分，可设置成模型字段所组成JSON对象，详见mongoose的Model.update接口中所指定的"doc"参数',
                    type: `${name}`
                }
            }
        },
        responses: {
            200: {
                body: {
                    type: 'object',
                    properties: {
                        data: {
                            displayName: '返回数据',
                            description: '接口返回的数据部分',
                            type: `object`,
                            properties: {
                                n: {
                                    displayName: '满足更新条件的文档数',
                                    description: 'MongoDB匹配出的所有满足更新条件的文档数',
                                    type: 'integer',
                                    required: true,
                                    example: 1,
                                    minimum: 0
                                },
                                nModified: {
                                    displayName: '被更新的文档数',
                                    description: 'MongoDB实际更新的文档数',
                                    type: 'integer',
                                    required: true,
                                    example: 1,
                                    minimum: 0
                                },
                                ok: {
                                    displayName: '命令执行状态',
                                    description: 'MongoDB命令执行状态，1为成功，非1为失败',
                                    type: 'integer',
                                    required: true,
                                    example: 1
                                }
                            }
                        },
                        errmsg: {
                            displayName: '错误信息',
                            description: '当调用接口异常时返回的错误描述信息，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '参数不能为空'
                        },
                        errcode: {
                            displayName: '错误代码',
                            description: '当调用接口异常时返回的错误代码，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '500'
                        }
                    }
                }
            }
        }
    };
};

/**
 * 生成模型的删除接口
 * @param name
 * @param displayName
 * @returns
 */
app.modelRemoveApi = (name, displayName) => {
    return {
        displayName: `删除${displayName || name}`,
        description: `删除${displayName || name}接口`,
        body: {
            type: `object`,
            properties: {
                cond: {
                    displayName: '删除条件',
                    description: '设置需要删除的文档所满足的条件，可使用模型字段所组成JSON对象，详见mongoose的Model.remove接口中所指定的"conditions"参数',
                    type: `${name}`
                }
            }
        },
        responses: {
            200: {
                body: {
                    type: 'object',
                    properties: {
                        data: {
                            displayName: '返回数据',
                            description: '接口返回的数据部分',
                            type: `object`,
                            properties: {
                                n: {
                                    displayName: '删除的文档数',
                                    description: 'MongoDB匹配出的所有满足删除条件的文档数',
                                    type: 'integer',
                                    required: true,
                                    example: 1,
                                    minimum: 0
                                },
                                ok: {
                                    displayName: '命令执行状态',
                                    description: 'MongoDB命令执行状态，1为成功，非1为失败',
                                    type: 'integer',
                                    required: true,
                                    example: 1
                                }
                            }
                        },
                        errmsg: {
                            displayName: '错误信息',
                            description: '当调用接口异常时返回的错误描述信息，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '参数不能为空'
                        },
                        errcode: {
                            displayName: '错误代码',
                            description: '当调用接口异常时返回的错误代码，调用正常时为null',
                            type: 'string',
                            required: true,
                            default: null,
                            example: '500'
                        }
                    }
                }
            }
        }
    };
};
