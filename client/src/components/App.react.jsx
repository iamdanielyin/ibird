/**
 * 入口组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const RouteUtils = require('../utils/RouteUtils');

const App = React.createClass({
    componentDidMount(){
        console.log('App.componentDidMount');
        fetch(RouteUtils.CONFIG_PUBLIC).then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);
        });
    },
    render(){
        return <div className="mainContent">
            {this.props.children}
        </div>;
    }
});

module.exports = App;