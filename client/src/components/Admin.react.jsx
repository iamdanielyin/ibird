/**
 * 后台主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const avatar = require('../publics/images/avatar.jpg');

const Admin = React.createClass({
    componentDidMount(){
    },
    render(){
        return (


            <div className="wrapper">

                <header className="main-header">

                    <a href="index2.html" className="logo">
                        <span className="logo-mini">i<b>bird</b></span>
                        <span className="logo-lg">i<b>bird</b></span>
                    </a>

                    <nav className="navbar navbar-static-top">
                        <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <li className="dropdown user user-menu">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                        <img src={avatar} className="user-image"
                                             alt="User Image"/>
                                        <span className="hidden-xs">Daniel Yin</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="user-header">
                                            <img src={avatar} className="img-circle"
                                                 alt="User Image"/>

                                            <p>
                                                Daniel Yin - Web Developer
                                                <small>Member since Nov. 2012</small>
                                            </p>
                                        </li>
                                        <li className="user-body">
                                            <div className="row">
                                                <div className="col-xs-4 text-center">
                                                    <a href="#">Followers</a>
                                                </div>
                                                <div className="col-xs-4 text-center">
                                                    <a href="#">Sales</a>
                                                </div>
                                                <div className="col-xs-4 text-center">
                                                    <a href="#">Friends</a>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <a href="#" className="btn btn-default btn-flat">Profile</a>
                                            </div>
                                            <div className="pull-right">
                                                <a href="#" className="btn btn-default btn-flat">Sign out</a>
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
                                <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                            </div>
                        </div>
                        <form action="#" method="get" className="sidebar-form">
                            <div className="input-group">
                                <input type="text" name="q" className="form-control" placeholder="搜索..."/>
              <span className="input-group-btn">
                <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i
                    className="fa fa-search"></i>
                </button>
              </span>
                            </div>
                        </form>
                        <ul className="sidebar-menu">
                            <li className="header">导航栏</li>
                            <li className="treeview">
                                <a href="#">
                                    <i className="fa fa-inbox"></i>
                                    <span>其他页面</span>
                                    <i className="fa fa-angle-left pull-right"></i>
                                </a>
                                <ul className="treeview-menu">
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-circle-o"></i>
                                            <span>报错页面</span>
                                            <i className="fa fa-angle-left pull-right"></i>
                                        </a>
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
                                        <a href="#"><i className="fa fa-circle-o"></i>注册页面<i
                                            className="fa fa-angle-left pull-right"></i></a>
                                        <ul className="treeview-menu">
                                            <li>
                                                <a href="demo_page/other_page/step_by_step_register.html"><i
                                                    className="fa fa-circle-o"></i>三步注册</a>
                                            </li>
                                            <li>
                                                <a href="demo_page/other_page/login_register.html"><i
                                                    className="fa fa-circle-o"></i>全屏注册登录</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="#"><i className="fa fa-circle-o"></i>找回密码</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="treeview">
                                <a href="#">
                                    <i className="fa fa-share"></i> <span>多级菜单</span>
                                    <i className="fa fa-angle-left pull-right"></i>
                                </a>
                                <ul className="treeview-menu">
                                    <li><a href="#"><i className="fa fa-circle-o"></i> 菜单</a></li>
                                    <li>
                                        <a href="#"><i className="fa fa-circle-o"></i>二级菜单<i
                                            className="fa fa-angle-left pull-right"></i></a>
                                        <ul className="treeview-menu">
                                            <li><a href="#"><i className="fa fa-circle-o"></i>三级菜单</a></li>
                                            <li>
                                                <a href="#"><i className="fa fa-circle-o"></i>三级菜单<i
                                                    className="fa fa-angle-left pull-right"></i></a>
                                                <ul className="treeview-menu">
                                                    <li><a href="#"><i className="fa fa-circle-o"></i>三级菜单</a></li>
                                                    <li><a href="#"><i className="fa fa-circle-o"></i>三级菜单</a></li>
                                                </ul>
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
                            Dashboard
                            <small>Version 0.1.0</small>
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
                            <li className="active">Dashboard</li>
                        </ol>
                    </section>

                    <section className="content">
                        <div className="row">
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                        <span className="info-box-icon bg-aqua"><i
                                            className="fa fa-google"></i></span>

                                    <div className="info-box-content">
                                        <span className="info-box-text">CPU Traffic</span>
                                        <span className="info-box-number">90<small>%</small></span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                        <span className="info-box-icon bg-red"><i
                                            className="fa fa-google"></i></span>

                                    <div className="info-box-content">
                                        <span className="info-box-text">Likes</span>
                                        <span className="info-box-number">41,410</span>
                                    </div>
                                </div>
                            </div>

                            <div className="clearfix visible-sm-block"></div>

                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                        <span className="info-box-icon bg-green"><i
                                            className="fa fa-google"></i></span>

                                    <div className="info-box-content">
                                        <span className="info-box-text">Sales</span>
                                        <span className="info-box-number">760</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                        <span className="info-box-icon bg-yellow"><i
                                            className="fa fa-google"></i></span>

                                    <div className="info-box-content">
                                        <span className="info-box-text">New Members</span>
                                        <span className="info-box-number">2,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="main-footer">
                    <div className="pull-right hidden-xs">
                        <b>Version</b> 0.1.0
                    </div>
                    <strong>Copyright &copy; 2016 <a href="https://github.com/yinfxs/ibird">ibird</a>.</strong> All
                    rights
                    reserved.
                </footer>

            </div>
        );
    }
});

module.exports = Admin;