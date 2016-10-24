/**
 * 入口组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const util = require('util');
const RouteUtils = require('../utils/RouteUtils');
const CodeUtils = require('../utils/CodeUtils');
const ToastrUtils = require('../utils/ToastrUtils');

const App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount() {
        const self = this;
        const currPathname = self.props.location.pathname;
        fetch(RouteUtils.CONFIGS+'?flag=public').then(function (res) {
            return res.json();
        }).then(function (json) {
            //TODO C_P代表config_public的意思
            localStorage.setItem('C_P', CodeUtils.encodeBase64(JSON.stringify(json), 5));
            //如果没有缓存token直接跳转到登录
            if (!localStorage.getItem('access_token')) return self.context.router.replace('/signin');
            //如果已有token，则鉴定token是否过期
            const token = JSON.parse(localStorage.getItem('access_token'));
            fetch(RouteUtils.AUTHENTICATION, {
                headers: {
                    "access_token": token.access_token
                }
            }).then(function (res) {
                return res.json();
            }).then(function (json) {
                //如果鉴权异常，提示并跳转到登录
                if (json.err) {
                    toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
                    return self.context.router.replace('/signin');
                }
                //如果无异常，不在主页的跳转到主页
                if (!currPathname.startsWith('/home')) return self.context.router.replace('/home');
            });
        });
    },
    render(){
        return <div className="mainContent">
            {this.props.children}
        </div>;
    }
});

module.exports = App;