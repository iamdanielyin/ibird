# 文档模块

> 模块代码：ibird-docs

本模块最核心的作用就是生成ibird应用的接口文档（当然你也可以单独使用），实现[RAML](http://raml.org/)文档和JavaScript对象的相互转换，内部处理是通过封装[js-yaml](https://www.npmjs.com/package/js-yaml)模块实现的。

## 安装模块

```js
npm i ibird-docs -D
```

## 引用模块

```js
const docs = require('ibird-docs');
```

## 开放接口

* docs.parse：解析接口，解析RAML文件或文档内容为JavaScript对象，可独立ibird使用
* docs.build：转换接口，转换JavaScript对象为RAML内容，可独立ibird使用
* docs.html：根据RAML内容或文件路径，生成对应的HTML文档，可独立ibird使用
* docs.gen：文档生成，根据ibird的配置对象生成完整的接口文档

### 解析接口

> 接口调用：docs.parse

参数列表：

* path：RAML文件地址或RAML文档内容
* flag：表示path是否为文档内容，可选

该接口的调用可以传递两个参数：path和flag，其中flag是可选参数，为文档内容标记，表示当flag为true时，path为RAML文档内容，否则为RAML文件路径。

### 转换接口

> 接口调用：docs.build

参数列表：

* doc：RAML的JavaScript对象
* file：输出文件路径，可选

当file为空时，不输出到文件系统，开发者可以直接通过接口返回值来获取RAML文档内容。

### 文档生成

> 接口调用：docs.gen

开发者可以通过调用该接口直接为ibird应用生成接口文档，参数列表如下：

* config：ibird的配置对象
* ramlpath：RAML保存文件路径，可选
* htmlpath：HTML文件保存路径，可选，仅在ramlpath不为空的前提下可用

当ramlpath和htmlpath皆为空时，直接返回文档内容，不输出到文件；当只需要生成RAML文件时，不需要指定htmlpath。

