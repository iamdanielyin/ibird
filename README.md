# ibird

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
