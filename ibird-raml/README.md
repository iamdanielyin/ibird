# RAML处理

> 模块代码：ibird-raml

这是一个辅助ibird进行RAML处理的工具模块（当然你也可以单独使用），它只做一件事：实现ibird配置对象到RAML文档的转换。开发者通过调用该模块开放的API，可以非常容易地获取转换过程中的某一个部分，例如以下几个场景：

1. 需要获得模型声明对应生成的RAML文档描述对象
2. 需要获得所有模型或单个模型的所有接口或单个接口的RAML文档描述对象
3. 需要获得所有自定义接口的文档描述对象

## 安装模块

```js
npm i ibird-raml -S
```

## 引用模块

```js
const raml = require('ibird-raml');
```

## 接口列表

* raml.modelType：处理单个数据模型的转换，传入模型的schema声明，返回对应的RAML类型描述对象

* raml.modelTypes：处理ibird配置中所有数据模型的转换，根据ibird的配置对象生成RAML文档的types部分，传入ibird配置对象，返回为对象类型，其中key为模型编码，value为RAML类型描述对象

* raml.modelApis：获取默认接口文档，根据ibird的配置对象生成RAML文档的模型默认API部分，传递两个参数，第一个参数为数据收集对象，生成的数据将设置到该对象上，第二个参数为ibird配置对象

* raml.modelApi：获取单个默认接口文档，根据ibird的配置对象生成单个数据模型的默认API部分，传递三个参数，第一个参数为数据收集对象，第二个参数为单个模型在ibird中的配置对象，第三个参数为全局接口前缀

* raml.routeApis：获取自定义接口文档，根据ibird的配置对象生成RAML文档的自定义路由API部分，传递两个参数，第一个为数据收集对象，第二个为ibird配置对象

* raml.modelListApi：获取默认列表接口文档，生成模型的列表查询接口，可传入两个参数，第一个参数为数据模型的name，第二个参数为数据模型的displayName，返回为对象类型

* raml.modelOneApi：获取默认单个查询接口文档，生成模型的单个查询接口，参数传递与返回同上

* raml.modelIdApi：获取默认ID查询接口文档，生成模型的ID查询接口，参数传递与返回同上

* raml.modelCreateApi：获取默认新增接口文档，生成模型的新增接口，参数传递与返回同上

* raml.modelUpdateApi：获取默认修改接口文档，生成模型的修改接口，参数传递与返回同上

* raml.modelRemoveApi：获取默认删除接口文档，生成模型的删除接口，参数传递与返回同上

## 注意

本模块只是一个辅助模块，并不生成任何RAML文档或者接口列表，如需文档生成，请查看[文档模块](/ibird-docs.md)；如需获取所有接口列表，请查看[服务模块](/ibird-service.md)。

