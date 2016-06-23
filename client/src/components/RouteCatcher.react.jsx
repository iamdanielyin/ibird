/**
 * 路由捕手组件
 * 捕获所有界面上的路由响应
 * Created by yinfxs on 16-6-21.
 */

'use strict';

const React = require('react');
const AdminIndex = require('./AdminIndex.react');
const AdminTable = require('./AdminTable.react');

const RouteCatcher = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount(){
        // console.log('RouteCatcher...');
    },
    render(){
        const props = this.props;
        const module = props.params.module;
        const path = props.params.path;
        const query = props.location.query;
        return (
            <AdminTable module={module} path={path} model={query.m}/>
        );
    }
});


module.exports = RouteCatcher;