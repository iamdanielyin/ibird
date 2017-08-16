/**
 * 后台主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const uuid = require('uuid');
const moment = require('moment');
const qs = require('qs');
const _ = require('lodash');
const Link = require('react-router').Link;
const avatar = require('../public/images/avatar.jpg');
const AdminIndex = require('AdminIndex');
const RouteUtils = require('RouteUtils');
const CodeUtils = require('CodeUtils');
const ToastrUtils = require('ToastrUtils');

const Admin = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const token = JSON.parse(localStorage.getItem('access_token') || '{}');
        const cv = JSON.parse(CodeUtils.decodeBase64(localStorage.getItem('C_V') || '{}', 5)) || [];
        token.data = token.data || {};
        return {
            profile: {},
            cv: cv,
            menu: <li></li>,
            token: token,
            access_token: token.access_token,
            roles: token.data.roles,
            org: token.data.org
        };
    },
    getProfile(){
        const query = qs.stringify({"access_token": this.state.access_token});
        fetch(RouteUtils.PROFILE + '?' + query).then(res => res.json()).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            this.setState({profile: json});
        });
    },
    getPrivateConfig() {
        const cv = this.state.cv;
        if(!_.isObject(cv)) return;
        this.setState({
            menu: this.createMenu(cv.menu),
            name: cv.name || this.state.name,
            version: cv.version || this.state.version
        });
    },
    createMenu(items){
        const self = this;
        const list = [];
        items.map((item, i) => {
            if ((!item.uri && (!item.items || item.items.length == 0)) || !item.label || !item.code) return;
            if (item.authid && this.state.roles.indexOf(item.authid) == -1) return;
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
                    <li className="treeview" key={i}>
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
        if (!localStorage.getItem('access_token')) return this.context.router.replace('/signin');
        this.getPrivateConfig();
        this.getProfile();
    },
    hideEmptyTreeview(){
        $('ul.treeview-menu').each((i, item) => {
            const $this = $(item);
            if ($this.css && $this.children('li').length == 0) $this.css('display', 'none');
            const $li = $this.parents('li.treeview');
            if ($li && $li.css && $this.children('li').length == 0) $li.css('display', 'none');
        });
    },
    activeFirstTreeview(){
        let flag = false;
        $('li.treeview').each((i, item) => {
            if (flag) return;
            const $this = $(item);
            if ('none' == $this.css('display')) return;
            $this.addClass('active');
            flag = true;
        });
    },
    componentDidUpdate(){
        this.hideEmptyTreeview();
        this.activeFirstTreeview();
    },
    componentDidMount(){
    },
    _onLogout(){
        const self = this;
        const query = qs.stringify({"access_token": self.state.access_token});
        fetch(RouteUtils.LOGOUT + '?' + query, {
            method: "POST"
        }).then(res => res.json()).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            localStorage.removeItem('access_token');
            return self.context.router.replace('/signin');
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
                    {!this.state.name ?
                        <Link to="/home" className="logo">
                            <span className="logo-mini">i<b>bird</b></span>
                            <span className="logo-lg">i<b>bird</b></span>
                        </Link> :
                        <Link to="/home" className="logo">
                            <span className="logo-mini">{this.state.name}</span>
                            <span className="logo-lg">{this.state.name}</span>
                        </Link>
                    }
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
                            <small>版本 {this.state.version || '0.1.0'}</small>
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
                        <b>Version</b> {this.state.version || '0.1.0'}
                    </div>
                    <strong>&copy; 2016 {!this.state.name ?
                        <a href="https://github.com/yinfxs/ibird" target="__blank">ibird</a> :
                        <Link to="/home">{this.state.name}</Link>}.</strong>
                    版权所有
                </footer>

            </div>
        );
    }
});

module.exports = Admin;