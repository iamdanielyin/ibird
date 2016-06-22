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

const App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount() {
        const self = this;
        if (!localStorage.getItem('access_token')) {
            fetch(RouteUtils.CONFIG_PUBLIC).then(function (res) {
                return res.json();
            }).then(function (json) {
                //TODO C_P代表config_public的意思
                localStorage.setItem('C_P', CodeUtils.encodeBase64(JSON.stringify(json), 5));
                const currPathname = self.props.location.pathname;
                if (currPathname == '/' || currPathname.startsWith('/index')) return self.context.router.push('/signin');
            });
        }
    },
    render(){
        return <div className="mainContent">
            {this.props.children}
        </div>;
    }
});

module.exports = App;