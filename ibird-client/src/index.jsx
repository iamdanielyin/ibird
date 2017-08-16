/**
 * 客户端入口文件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const hashHistory = require('react-router').hashHistory;

const App = require('App');
const Signin = require('Signin');
const Signup = require('Signup');
const Forgot = require('Forgot');
const Admin = require('Admin');
const NoMatch = require('NoMatch');
const RouteCatcher = require('RouteCatcher');

moment.locale('zh-cn');//设置全局国际化

require('RequireUtils');


const app = document.createElement('div');
document.body.appendChild(app);

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="signin" component={Signin}/>
            <Route path="signup" component={Signup}/>
            <Route path="forgot" component={Forgot}/>
            <Route path="home" component={Admin}>
                <Route path=":module/:path" component={RouteCatcher}/>
            </Route>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>
), app);