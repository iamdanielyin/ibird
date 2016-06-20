/**
 * 客户端入口文件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const hashHistory = require('react-router').hashHistory;

const AdminConfigUtils = require('./utils/AdminConfigUtils');
const MyButtonController = require('./components/MyButtonController');

const App = require('./components/App.react');
const Signin = require('./components/Signin.react');
const Signup = require('./components/Signup.react');
const Admin = require('./components/Admin.react');
const NoMatch = require('./components/NoMatch.react');

require('whatwg-fetch');
require('./utils/RequireUtils');

require('./publics/css/index.less');


AdminConfigUtils.initialize(function (configs) {
    console.log(configs);
    initMenus(configs);
    initRoutes(configs);
});

/**
 * 初始化菜单
 */
function initMenus(configs) {

}
/**
 * 初始化路由
 */
function initRoutes(configs) {

}

const app = document.createElement('div');
document.body.appendChild(app);

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="signin" component={Signin}/>
            <Route path="signup" component={Signup}/>
            <Route path="index" component={Admin}/>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>
), app);