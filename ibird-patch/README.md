# 补丁工具

> 模块代码：ibird-patch

这是一个为了方便生成项目补丁的工具模块，主要的工作就是复制指定文件或文件夹到目标目录，复制后可以选择是否压缩打包。

## 安装模块

```bash
npm i ibird-patch -D
```

## 使用步骤

首先你需要新建一个项目配置文件，把所有补丁的配置项都在里面定义好，后面当需要打补丁时，你的工作就是执行这个文件而已，配置文件的内容大致如下所示：

```js
// 0. 引用模块
const patch = require('ibird-patch');

// 1. 配置打包
patch.config({
    output: 'string，输出目录，相对路径或绝对路径皆可',
    compress: 'bool，是否生成压缩文件，默认false',
    sources: {
        "输入相对路径文件1": "string，输出目标路径1",
        "输入绝对路径文件2": "string，输出目标路径2",
        "输入相对目录1": "string，输出目标目录1",
        "输入绝对目录2": "string，输出目标目录2",
        "输入相对目录地址1": {
            "输入选择文件名1": "string，输出目标路径1",
            "输入选择文件名2": "string，输出目标路径2",
            "输入选择目录名1": "string，输出目标目录1",
            "输入选择目录名2": "string，输出目标目录2"
        },
        "!输入相对目录地址1": {
            dest: "输出目标目录1",
            filter: "string或array，需要忽略的文件或目录名称，通过英文空格分隔" // 这里只能指定文件或文件夹的名称
        }
    }
});

// 2. 输出补丁
patch.output();
```

### 参数列表

| 参数 | 对象 | 描述 | 是否必输 |
| :--- | :--- | :--- | :--- |
| output | string | 输出目录，相对或绝对路径皆可 | 必输 |
| sources | object | 需要打包的路径对象，key为源文件或目录路径，value为目标文件或目录路径，相对或绝对路径皆可 | 必输 |
| compress | boolean | 是否压缩 | 可选，默认为false |
| format | string | 仅支持zip和tar两种格式 | 可选，默认zip |
| filename | string | 压缩文件名，相对或绝对路径皆可，仅当compress为true时有效 | 可选 |
| options | object | archiverjs初始化对象时的参数，参见高级应用章节 | 可选 |
| callback | function | 打包完成后的回调函数，接收的第一个参数为Error对象，成功生成时该对象为空。需要注意，配置后该参数后不会再出现控制台提示 | 可选 |

### 打包配置

使用打包的第一步是初始化配置，配置对象的格式如下所示：

```js
const config = {
    output: '/home/ibird/output', // string，输出目录，相对路径或绝对路径皆可
    compress: false, // bool，是否生成压缩文件，默认false
    sources: {
        'relative/file': "/home/ibird/output/relative/file",
        "/home/ibird/project/absolute/file": "/home/ibird/output/absolute/file",
        "relative/dir": "/home/ibird/output/relative/dir",
        "/home/ibird/project/absolute/dir": "/home/ibird/output/absolute/dir",
        "relative/dir2": {
            "file01": "/home/ibird/output/relative/dir2/file01",
            "file02": "/home/ibird/output/relative/dir2/file02",
            "dir01": "/home/ibird/output/relative/dir2/dir01",
            "dir02": "/home/ibird/output/relative/dir2/dir02"
        },
        "!relative/dir3": {
            dest: "/home/ibird/output/relative/dir3",
            filter: "skipFile1 skipFile2 skipDir1 skipDir2"
        },
        "/home/ibird/project/absolute/dir3": {
            "file01": "/home/ibird/output/absolute/dir3/file01",
            "file02": "/home/ibird/output/absolute/dir3/file02",
            "dir01": "/home/ibird/output/absolute/dir3/dir01",
            "dir02": "/home/ibird/output/absolute/dir3/dir02"
        },
        "!/home/ibird/project/relative/dir4": {
            dest: "/home/ibird/output/relative/dir4",
            filter: "skipFile1 skipFile2 skipDir1 skipDir2"
        }
    }
};
```

定义好配置之后，需要调用config接口将配置初始化到patch模块中：

```js
patch.config(config);
```

当你需要打多个环境的补丁时，就需要多次调用config接口，当然也可以一次性批量初始化所有配置：

```js
patch.config([config1, config2, config3]);
```

### 输出补丁

待所有配置都初始化成功之后，就可以调用output接口输出补丁文件了：

```js
patch.output();
```

输出完成后，控制台会出现相应的提示信息：

```bash
生成补丁成功：/Users/yinfxs/patch_dest/k11-dist-pro
生成补丁成功：/Users/yinfxs/patch_dest/k11-dist-wosoft
生成补丁成功：/Users/yinfxs/patch_dest/k11-dist-test
生成补丁成功：/Users/yinfxs/patch_dest/just_for_test.zip
```

## 高级应用

本章节描述了工具对于以下几个应用场景的支持：

1. 当你需要打包的文件夹下有很多文件，但你只想要打包其中几个文件或文件夹的时候
2. 当你需要打包的文件夹下同样有很多文件，但你只想将指定的几个文件或文件夹忽略，其他全部打包的时候
3. 当你想要打tar.gz格式的压缩包文件
4. 当你想要更改压缩级别时

如果你想打包一个目录下的某几个文件或文件夹，你可以这样配置sources：

```js
const config = {
    output: '/home/ibird/output',
    sources: {
        "relative/dir2": {
            "file01": "/home/ibird/output/relative/dir2/file01",
            "file02": "/home/ibird/output/relative/dir2/file02",
            "dir01": "/home/ibird/output/relative/dir2/dir01",
            "dir02": "/home/ibird/output/relative/dir2/dir02"
        },
        "/home/ibird/project/absolute/dir3": {
            "file01": "/home/ibird/output/absolute/dir3/file01",
            "file02": "/home/ibird/output/absolute/dir3/file02",
            "dir01": "/home/ibird/output/absolute/dir3/dir01",
            "dir02": "/home/ibird/output/absolute/dir3/dir02"
        }
    }
};
```

如果你想忽略一个目录下的某几个文件或文件夹，其余全部打包，你可以这样配置sources：

```js
const config = {
    output: '/home/ibird/output',
    sources: {
        "!relative/dir3": {
            dest: "/home/ibird/output/relative/dir3",
            filter: "skipFile1 skipFile2 skipDir1 skipDir2"
        },
        "!/home/ibird/project/relative/dir4": {
            dest: "/home/ibird/output/relative/dir4",
            filter: "skipFile1 skipFile2 skipDir1 skipDir2"
        }
    }
};
```

如果需要修改压缩相关的配置，可以配置options属性，options属性可参见[Archiver文档](https://archiverjs.com/docs/Archiver.html)。

