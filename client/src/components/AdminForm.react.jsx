/**
 * 表单组件:
 * 1.初始化表单
 * 2.表单验证
 * 3.响应表单操作
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const RouteUtils = require('../utils/RouteUtils');
const ToastrUtils = require('../utils/ToastrUtils');
const _ = require('underscore');
const qs = require('qs');
const uuid = require('node-uuid');

const AdminForm = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {
            moduleCode: this.props.module,
            modelCode: this.props.model,
            i: this.props.i,
            data: {}
        };
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        state.token = token;
        state.access_token = token.access_token;
        return state;
    },
    fetchData(){
        const self = this;
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode + '/' + self.state.i), {
            headers: {
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({data: json});
            self.refreshForm();
        });
    },
    refreshForm(){
    },
    componentDidMount(){
        // console.log('AdminTable...');
        const self = this;
        if (this.state.i) this.fetchData();
    },
    render(){
        return (
            <div>表单组件：模块编码({this.state.moduleCode}),模型编码({this.state.modelCode})</div>
        );
    }
});

module.exports = AdminForm;