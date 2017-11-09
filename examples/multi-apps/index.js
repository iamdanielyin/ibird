/**
 * Hello ibird! :)
 * @type {App}
 */

// app1
const app1 = require('../../lib/index').newApp({
    name: 'app1',
    port: 5001
});
app1.get('/', ctx => ctx.body = 'I am app1.');
app1.play();

// app2
const app2 = require('../../lib/index').newApp({
    name: 'app2',
    port: 5002
});
app2.get('/', ctx => ctx.body = 'I am app2.');
app2.play();


// app3
const App = require('../../lib/index').App;
const app3 = require('../../lib/index').newApp({
    name: 'app3',
    port: 5003
});
app3.get('/', ctx => ctx.body = 'I am app3.');
app3.play();

// app4
const app4 = new App({
    name: 'app4',
    port: 5004
});
app4.get('/', ctx => ctx.body = 'I am app4.');
app4.play();