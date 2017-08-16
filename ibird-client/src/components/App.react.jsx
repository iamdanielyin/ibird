/**
 * 入口组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const util = require('util');
const qs = require('qs');
const RouteUtils = require('RouteUtils');
const CodeUtils = require('CodeUtils');
const ToastrUtils = require('ToastrUtils');

const App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount(){
    },
    componentWillMount() {
        const self = this;
        const currPathname = self.props.location.pathname;
        fetch(RouteUtils.CONFIGS + '?flag=public').then(res => res.json()).then(json => {
            //TODO C_P代表config_public的意思
            if (json.name && $(document).attr('title') != json.name) $(document).attr('title', json.name);
            localStorage.setItem('C_P', CodeUtils.encodeBase64(JSON.stringify(json), 5));
            //如果没有缓存token直接跳转到登录
            if (!localStorage.getItem('access_token')) return self.context.router.replace('/signin');
            //如果已有token，则鉴定token是否过期
            const token = JSON.parse(localStorage.getItem('access_token'));
            const query = qs.stringify({access_token: token.access_token});
            fetch(RouteUtils.AUTHENTICATION + '?' + query).then(res => res.json()).then(json => {
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