/**
 * 主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const assign = require('object-assign');
const Link = require('react-router').Link;
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const FormFactory = require('FormFactory');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');
const config = require('ibird.config');

const AdminIndex = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        return {
            data: [],
            token: token,
            access_token: token.access_token
        };
    },
    componentWillMount(){
        this.context.router.replace('/home/preset/user');
    },
    componentDidMount(){
    },
    render(){
        return (
            <div>欢迎使用ibird</div>
        );
    }
});

module.exports = AdminIndex;