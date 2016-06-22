/**
 * 后台主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const avatar = require('../publics/images/avatar.jpg');
const AdminIndex = require('./AdminIndex.react');
const AdminConfigUtils = require('../utils/AdminConfigUtils');

const Admin = React.createClass({
    createMenus() {
        console.log(AdminConfigUtils.configs);

    },
    componentDidMount(){
        console.log('componentDidMount');
        this.createMenus();
    },
    render(){
        const module = this.props.params.module;
        const path = this.props.params.path;
        let content = (!module && !path) ? <AdminIndex/> : this.props.children;
        return (
            <div className="wrapper">
                <header className="main-header">
                    <Link to="/index" className="logo">
                        <span className="logo-mini">i<b>bird</b></span>
                        <span className="logo-lg">i<b>bird</b></span>
                    </Link>
                    <nav className="navbar navbar-static-top">
                        <Link to="/index" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </Link>
                        {/* 自定义菜单 */}
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <li className="dropdown user user-menu">
                                    <Link to="/index" className="dropdown-toggle" data-toggle="dropdown">
                                        <img src={avatar} className="user-image" alt="User Image"/>
                                        <span className="hidden-xs">Daniel Yin</span>
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li className="user-header">
                                            <img src={avatar} className="img-circle" alt="User Image"/>
                                            <p>
                                                <span>Daniel Yin - Web开发者</span>
                                                <small>注册日期：2012.09</small>
                                            </p>
                                        </li>
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <Link to="/index" className="btn btn-default btn-flat">个人详情</Link>
                                            </div>
                                            <div className="pull-right">
                                                <Link to="/index" className="btn btn-default btn-flat">退出</Link>
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
                                <p>Daniel Yin</p>
                                <Link to="/index"><i className="fa fa-circle text-success"></i> 在线</Link>
                            </div>
                        </div>
                        <form action="#" method="get" className="sidebar-form">
                            <div className="input-group">
                                <input type="text" name="q" className="form-control" placeholder="搜索..."/>
                                <span className="input-group-btn">
                                    <button type="submit" name="search" id="search-btn" className="btn btn-flat">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </span>
                            </div>
                        </form>
                        <ul className="sidebar-menu">
                            <li className="header">导航栏</li>
                            <li className="treeview">
                                <Link to="/index">
                                    <i className="fa fa-inbox"></i>
                                    <span>其他页面</span>
                                    <i className="fa fa-angle-left pull-right"></i>
                                </Link>
                                <ul className="treeview-menu">
                                    <li>
                                        <Link to="/index">
                                            <i className="fa fa-circle-o"></i>
                                            <span>报错页面</span>
                                            <i className="fa fa-angle-left pull-right"></i>
                                        </Link>
                                        <ul className="treeview-menu">
                                            <li>
                                                <Link to='/signin' className="fa fa-circle-o"><i></i>
                                                    <span>登录页</span></Link>
                                            </li>
                                            <li>
                                                <Link to='/signup' className="fa fa-circle-o"><i></i>
                                                    <span>注册页</span></Link>
                                            </li>
                                            <li>
                                                <Link to='/forgot' className="fa fa-link"><i></i>
                                                    <span>忘记密码</span></Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/index">
                                            <i className="fa fa-circle-o"></i>
                                            <span>注册页面</span>
                                            <i className="fa fa-angle-left pull-right"></i>
                                        </Link>
                                        <ul className="treeview-menu">
                                            <li>
                                                <Link to="/index">
                                                    <i className="fa fa-circle-o"></i>
                                                    <span>三步注册</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/index">
                                                    <i className="fa fa-circle-o"></i>
                                                    <span>全屏注册登录</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/index">
                                            <i className="fa fa-circle-o"></i>
                                            <span>找回密码</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="treeview">
                                <Link to="/index">
                                    <i className="fa fa-share"></i> <span>多级菜单</span>
                                    <i className="fa fa-angle-left pull-right"></i>
                                </Link>
                                <ul className="treeview-menu">
                                    <li>
                                        <Link to="/index">
                                            <i className="fa fa-circle-o"></i> <span>菜单</span></Link>
                                    </li>
                                    <li>
                                        <Link to="/index">
                                            <i className="fa fa-circle-o"></i>
                                            <span>二级菜单</span>
                                            <i className="fa fa-angle-left pull-right"></i>
                                        </Link>
                                        <ul className="treeview-menu">
                                            <li>
                                                <Link to="/index">
                                                    <i className="fa fa-circle-o"></i>
                                                    <span>三级菜单</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/index">
                                                    <i className="fa fa-circle-o"></i>
                                                    <span>三级菜单</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </section>
                </aside>

                <div className="content-wrapper">
                    <section className="content-header">
                        <h1>
                            仪表盘
                            <small>版本 0.1.0</small>
                        </h1>
                        <ol className="breadcrumb">
                            <li><Link to="/index"><i className="fa fa-dashboard"></i> 主页</Link></li>
                            <li className="active">仪表盘</li>
                        </ol>
                    </section>

                    <section className="content" style={{minHeight:'600px'}}>{content}</section>
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