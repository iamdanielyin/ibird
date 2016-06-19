/**
 * 客户端入口文件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
require('whatwg-fetch');
const routes = require('./routes');
const index_less = require('./public/styles/index.less');
const MyButtonController = require('./components/MyButtonController');

function getAdminConfig() {
    fetch(routes.ADMIN_CONFIG).then(function (res) {
        return res.json();
    }).then(function (json) {
        console.log(json);
    });
}
getAdminConfig();

// const App = React.createClass({
//     render() {
//         return (<MyButtonController/>);
//     }
// });

const app = document.createElement('div');
document.body.appendChild(app);

ReactDOM.render(<MyButtonController/>, app);