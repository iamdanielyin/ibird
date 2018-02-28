# ibird

[![NPM version](https://img.shields.io/npm/v/ibird.svg?style=flat)](https://npmjs.org/package/ibird)
[![Build Status](https://img.shields.io/travis/yinfxs/ibird.svg?style=flat)](https://travis-ci.org/yinfxs/ibird)
[![NPM downloads](http://img.shields.io/npm/dm/ibird.svg?style=flat)](https://npmjs.org/package/ibird)
[![Dependencies](https://david-dm.org/yinfxs/ibird.svg)](https://david-dm.org/yinfxs/ibird)

English | [简体中文](https://zhuanlan.zhihu.com/p/30961351)

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

// response
app.get('/', ctx => {
  ctx.body = `Hello ibird.`;
});

app.play();
```

If you run this with:

```bash
$ node index.js
```

You should see the ibird response printed out:

```bash
$ Listen and serve on 0.0.0.0:3000
```

Congratulations - You've just created an application using ibird!

### Next Steps

We prepared a [wiki page](https://github.com/yinfxs/ibird/wiki). You can find tons of useful things there.

### Contributing

We actively welcome pull requests.

### Changelog

Changes are tracked as [GitHub releases](https://github.com/yinfxs/ibird/releases).

### License

ibird is [Apache-2.0-licensed](https://github.com/yinfxs/ibird/blob/master/LICENSE).
