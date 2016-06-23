/**
 * 表格组件：
 * 1.初始化表格
 * 2.响应表格操作
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');

const AdminTable = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {};
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        state.token = token;
        state.access_token = token.access_token;
        return state;
    },
    componentDidMount(){
        console.log('AdminTable...');
    },
    render(){
        return (
            <div>
                <h3>{'模块编码 = ' + this.props.module}</h3>
                <h3>{'路由指向 = ' + this.props.path}</h3>
                <h3>{'模型编码 = ' + this.props.model}</h3>
            </div>
        );
    }
});

module.exports = AdminTable;