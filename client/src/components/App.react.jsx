/**
 * 入口组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;

const App = React.createClass({
    render(){
        return <div>
            <h1>入口组件</h1>
            <ul>
                <li><Link to={'/signin'}>登录</Link></li>
                <li><Link to={'/signup'}>注册</Link></li>
                <li><Link to={'/index'}>主页</Link></li>
            </ul>
            <div className="mainContent">
                {this.props.children}
            </div>
        </div>
    }
});

module.exports = App;