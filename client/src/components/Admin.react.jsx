/**
 * 后台主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const moment = require('moment');
const _ = require('lodash');
const Link = require('react-router').Link;
const avatar = require('../public/images/avatar.jpg');
const AdminIndex = require('./AdminIndex.react');
const RouteUtils = require('../utils/RouteUtils');
const CodeUtils = require('../utils/CodeUtils');
const ToastrUtils = require('../utils/ToastrUtils');

const Admin = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {profile: {}, menu: <li></li>};
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        state.token = token;
        state.access_token = token.access_token;
        return state;
    },
    getProfile(){
        fetch(RouteUtils.PROFILE, {
            headers: {
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            this.setState({profile: json});
        }.bind(this));
    },
    getPrivateConfig() {
        const self = this;
        fetch(RouteUtils.CONFIGS + '?flag=private', {
            headers: {
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            //TODO C_V代表config_private的意思
            localStorage.setItem('C_V', CodeUtils.encodeBase64(JSON.stringify(json), 5));
            self.setState({menu: self.createMenu(json.menu, true)}, function () {
                console.log(self.state.menu);
            });
        });
    },
    createMenu(items, first = false){
        const self = this;
        const list = [];
        items.map(function (item, i) {
            if ((!item.uri && (!item.items || item.items.length == 0)) || !item.label || !item.code) return;
            if (!item.items || item.items.length == 0) {
                //最终节点：无任何子节点
                let uri = item.uri, path = null, com = null;
                if (uri.startsWith('http://') || uri.startsWith('https://')) {
                    path = '/preset/link';
                    com = 'link';
                } else if (uri.startsWith('com:')) {
                    com = uri.substring('com:'.length, uri.length);
                    path = '/preset/' + com;
                } else {
                    path = item.uri.startsWith('/') ? item.uri : '/' + item.uri;
                }
                list.push(
                    <li key={i}>
                        <Link to={{pathname: "/home" + path, state: {com: com, item: item}}}>
                            <i className={"fa fa-" + (item.icon || 'circle-o')}></i> <span>{item.label}</span>
                        </Link>
                    </li>
                );
            } else {
                //包含子节点
                list.push(
                    <li className={first ? "treeview" : ""} key={i}>
                        <a href="#">
                            <i className={"fa fa-" + item.icon || 'circle-o'}></i> <span>{item.label}</span>
                            <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                            </span>
                        </a>
                        <ul className="treeview-menu">
                            {self.createMenu(item.items)}
                        </ul>
                    </li>
                );
            }
        });
        return list;
    },
    componentWillMount(){
        if (!localStorage.getItem('access_token')) return this.context.router.push('/signin');
        this.getPrivateConfig();
        this.getProfile();
    },
    componentDidMount(){
    },
    _onLogout(){
        const self = this;
        fetch(RouteUtils.LOGOUT, {
            method: "POST",
            headers: {
                "access_token": self.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            localStorage.removeItem('access_token');
            return self.context.router.push('/signin');
        });
    },
    render(){
        const self = this;
        const module = this.props.params.module;
        const path = this.props.params.path;
        let content = (!module && !path) ? <AdminIndex/> : this.props.children;
        const username = localStorage.getItem('username');
        return (
            <div className="wrapper">
                <header className="main-header">
                    <Link to="/home" className="logo">
                        <span className="logo-mini">i<b>bird</b></span>
                        <span className="logo-lg">i<b>bird</b></span>
                    </Link>
                    <nav className="navbar navbar-static-top">
                        <Link to="/home" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </Link>
                        {/* 自定义菜单 */}
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <li className="dropdown user user-menu">
                                    <a href="/home" className="dropdown-toggle" data-toggle="dropdown">
                                        <img src={avatar} className="user-image" alt={username}/>
                                        <span className="hidden-xs">{username ||
                                        <i className="fa fa-user-secret" aria-hidden="true"></i>}</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="user-header">
                                            <img src={avatar} className="img-circle" alt={username}/>
                                            <p>
                                                {username}
                                                {/*<small>注册日期：{moment(this.state.profile.ts, 'x').format('llll')}</small>*/}
                                            </p>
                                        </li>
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <Link to="/home" className="btn btn-default btn-flat">主页</Link>
                                            </div>
                                            <div className="pull-right">
                                                <button onClick={self._onLogout} className="btn btn-default btn-flat">
                                                    退出
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src={avatar} className="img-circle" alt="User Image"/>
                            </div>
                            <div className="pull-left info">
                                <p>{username}</p>
                                <Link to="/home"><i className="fa fa-circle text-success"></i> 在线</Link>
                            </div>
                        </div>
                        {/*<form action="#" method="get" className="sidebar-form">*/}
                        {/*<div className="input-group">*/}
                        {/*<input type="text" name="q" className="form-control" placeholder="搜索..."/>*/}
                        {/*<span className="input-group-btn">*/}
                        {/*<button type="submit" name="search" id="search-btn" className="btn btn-flat">*/}
                        {/*<i className="fa fa-search"></i>*/}
                        {/*</button>*/}
                        {/*</span>*/}
                        {/*</div>*/}
                        {/*</form>*/}
                        <ul className="sidebar-menu">
                            <li className="header">导航栏</li>
                            {this.state.menu}
                        </ul>
                    </section>
                </aside>

                <div className="content-wrapper" style={{minHeight: '60rem'}}>
                    <section className="content-header">
                        <h1>
                            仪表盘
                            <small>版本 0.1.0</small>
                        </h1>
                        <ol className="breadcrumb">
                            <li><Link to="/home"><i className="fa fa-dashboard"></i> 主页</Link></li>
                            <li className="active">仪表盘</li>
                        </ol>
                    </section>

                    <section className="content">{content}</section>
                </div>

                <footer className="main-footer">
                    <div className="pull-right hidden-xs">
                        <b>Version</b> 0.1.0
                    </div>
                    <strong>&copy; 2016 <a href="https://github.com/yinfxs/ibird" target="__blank">ibird</a>.</strong>
                    版权所有
                </footer>

            </div>
        );
    }
});

module.exports = Admin;