# ibird

[![Join the chat at https://gitter.im/ibirdjs/Lobby](https://img.shields.io/gitter/room/ibirdjs/Lobby.svg?style=flat)](https://gitter.im/ibirdjs/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![NPM version](https://img.shields.io/npm/v/ibird.svg?style=flat)](https://npmjs.org/package/ibird)
[![Build Status](https://img.shields.io/travis/yinfxs/ibird.svg?style=flat)](https://travis-ci.org/yinfxs/ibird)
[![Coverage Status](https://img.shields.io/coveralls/yinfxs/ibird.svg?style=flat)](https://coveralls.io/r/yinfxs/ibird)
[![NPM downloads](http://img.shields.io/npm/dm/ibird.svg?style=flat)](https://npmjs.org/package/ibird)
[![Dependencies](https://david-dm.org/yinfxs/ibird.svg)](https://david-dm.org/yinfxs/ibird)

[以中文查看](https://zhuanlan.zhihu.com/p/30961351)

A lightweight and flexible web development framework.

## Getting Started


### Prerequisites

Install ibird from npm

With yarn:

```sh
yarn add ibird
```

or alternatively using npm:

```sh
npm install --save ibird
```

### Writing Code

We can put this code in a file named `index.js`

```js
const app = require('ibird').newApp();
app.get('/', ctx => ctx.body = `Hello ibird.`);
app.play();
```

If you run this with:

```bash
$ node index.js
```

You should see the ibird response printed out:

```bash
$ Home: http://localhost:3000
```

Congratulations - You've just created an application using ibird!


### Contributing

We actively welcome pull requests.

### Changelog

Changes are tracked as [GitHub releases](https://github.com/yinfxs/ibird/releases).

### License

ibird is [Apache-2.0-licensed](https://github.com/yinfxs/ibird/blob/master/LICENSE).
