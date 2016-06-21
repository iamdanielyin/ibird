/**
 * 路由捕手组件
 * 捕获所有界面上的路由响应
 * Created by yinfxs on 16-6-21.
 */

'use strict';

const React = require('react');
const AdminIndex = require('./AdminIndex.react');

const RouteCatcher = React.createClass({
    componentDidMount(){
        console.log('RouteCatcher...');
    },
    render(){
        const module = this.props.params.module;
        const path = this.props.params.path;
        let content = <AdminIndex/>;
        console.log('模块编码 =', module, '路由指向 =', path);
        return content;
    }
});


module.exports = RouteCatcher;