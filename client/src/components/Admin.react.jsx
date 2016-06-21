/**
 * 后台主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');

const avatar = require('../publics/images/avatar.jpg');

const Admin = React.createClass({
    componentDidMount(){
    },
    render(){
        return (
            <div className="hold-transition skin-blue-light fixed scrollbar">

                <div className="wrapper">

                    <header className="main-header">

                        <a href="index2.html" className="logo">
                            <span className="logo-mini"><b>A</b>LT</span>
                            <span className="logo-lg"><b>Admin</b>LTE</span>
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
                                            <span className="hidden-xs">Alexander Pierce</span>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li className="user-header">
                                                <img src={avatar} className="img-circle"
                                                     alt="User Image"/>

                                                <p>
                                                    Alexander Pierce - Web Developer
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
                                    <p>Alexander Pierce</p>
                                    <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                                </div>
                            </div>
                            <form action="#" method="get" className="sidebar-form">
                                <div className="input-group">
                                    <input type="text" name="q" className="form-control" placeholder="Search..."/>
              <span className="input-group-btn">
                <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i
                    className="fa fa-search"></i>
                </button>
              </span>
                                </div>
                            </form>
                            <ul className="sidebar-menu">
                                <li className="header">导航栏</li>
                                <li className="active treeview">
                                    <a href="#">
                                        <i className="fa fa-dashboard"></i> <span>Dashboard</span> <i
                                        className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="index.html"><i className="fa fa-circle-o"></i> Dashboard v1</a>
                                        </li>
                                        <li className="active"><a href="index2.html"><i className="fa fa-circle-o"></i>
                                            Dashboard v2</a></li>
                                    </ul>
                                </li>

                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-inbox"></i> <span>其他页面</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li>
                                            <a href="#"><i className="fa fa-circle-o"></i>报错页面<i className="fa fa-angle-left pull-right"></i></a>
                                            <ul className="treeview-menu">
                                                <li><a href="demo_page/error/404.html"><i className="fa fa-circle-o"></i>404_fullpage</a>
                                                </li>
                                                <li>
                                                    <a href="demo_page/error/404_inner.html"><i className="fa fa-circle-o"></i>404_inner</a>
                                                </li>
                                                <li><a href="demo_page/error/500.html"><i className="fa fa-circle-o"></i>500_fullpage</a>
                                                </li>
                                                <li>
                                                    <a href="demo_page/error/500_inner.html"><i className="fa fa-circle-o"></i>500_inner</a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#"><i className="fa fa-circle-o"></i>注册页面<i className="fa fa-angle-left pull-right"></i></a>
                                            <ul className="treeview-menu">
                                                <li>
                                                    <a href="demo_page/other_page/step_by_step_register.html"><i className="fa fa-circle-o"></i>三步注册</a>
                                                </li>
                                                <li>
                                                    <a href="demo_page/other_page/login_register.html"><i className="fa fa-circle-o"></i>全屏注册登录</a>
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
                                            <a href="#"><i className="fa fa-circle-o"></i>二级菜单<i className="fa fa-angle-left pull-right"></i></a>
                                            <ul className="treeview-menu">
                                                <li><a href="#"><i className="fa fa-circle-o"></i>三级菜单</a></li>
                                                <li>
                                                    <a href="#"><i className="fa fa-circle-o"></i>三级菜单<i className="fa fa-angle-left pull-right"></i></a>
                                                    <ul className="treeview-menu">
                                                        <li><a href="#"><i className="fa fa-circle-o"></i>三级菜单</a></li>
                                                        <li><a href="#"><i className="fa fa-circle-o"></i>三级菜单</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-files-o"></i>
                                        <span>Layout Options</span>
                                        <span className="label label-primary pull-right">4</span>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="pages/layout/top-nav.html"><i className="fa fa-circle-o"></i> Top
                                            Navigation</a></li>
                                        <li><a href="pages/layout/boxed.html"><i className="fa fa-circle-o"></i>
                                            Boxed</a></li>
                                        <li><a href="pages/layout/fixed.html"><i className="fa fa-circle-o"></i>
                                            Fixed</a></li>
                                        <li><a href="pages/layout/collapsed-sidebar.html"><i
                                            className="fa fa-circle-o"></i> Collapsed Sidebar</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a href="pages/widgets.html">
                                        <i className="fa fa-th"></i> <span>Widgets</span>
                                        <small className="label pull-right bg-green">new</small>
                                    </a>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-pie-chart"></i>
                                        <span>Charts</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="pages/charts/chartjs.html"><i className="fa fa-circle-o"></i>
                                            ChartJS</a></li>
                                        <li><a href="pages/charts/morris.html"><i className="fa fa-circle-o"></i> Morris</a>
                                        </li>
                                        <li><a href="pages/charts/flot.html"><i className="fa fa-circle-o"></i> Flot</a>
                                        </li>
                                        <li><a href="pages/charts/inline.html"><i className="fa fa-circle-o"></i> Inline
                                            charts</a></li>
                                    </ul>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-laptop"></i>
                                        <span>UI Elements</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="pages/UI/general.html"><i className="fa fa-circle-o"></i>
                                            General</a></li>
                                        <li><a href="pages/UI/icons.html"><i className="fa fa-circle-o"></i> Icons</a>
                                        </li>
                                        <li><a href="pages/UI/buttons.html"><i className="fa fa-circle-o"></i>
                                            Buttons</a></li>
                                        <li><a href="pages/UI/sliders.html"><i className="fa fa-circle-o"></i>
                                            Sliders</a></li>
                                        <li><a href="pages/UI/timeline.html"><i className="fa fa-circle-o"></i> Timeline</a>
                                        </li>
                                        <li><a href="pages/UI/modals.html"><i className="fa fa-circle-o"></i> Modals</a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-edit"></i> <span>Forms</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="pages/forms/general.html"><i className="fa fa-circle-o"></i>
                                            General Elements</a></li>
                                        <li><a href="pages/forms/advanced.html"><i className="fa fa-circle-o"></i>
                                            Advanced Elements</a></li>
                                        <li><a href="pages/forms/editors.html"><i className="fa fa-circle-o"></i>
                                            Editors</a></li>
                                    </ul>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-table"></i> <span>Tables</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="pages/tables/simple.html"><i className="fa fa-circle-o"></i> Simple
                                            tables</a></li>
                                        <li><a href="pages/tables/data.html"><i className="fa fa-circle-o"></i> Data
                                            tables</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a href="pages/calendar.html">
                                        <i className="fa fa-calendar"></i> <span>Calendar</span>
                                        <small className="label pull-right bg-red">3</small>
                                    </a>
                                </li>
                                <li>
                                    <a href="pages/mailbox/mailbox.html">
                                        <i className="fa fa-envelope"></i> <span>Mailbox</span>
                                        <small className="label pull-right bg-yellow">12</small>
                                    </a>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-folder"></i> <span>Examples</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="pages/examples/invoice.html"><i className="fa fa-circle-o"></i>
                                            Invoice</a></li>
                                        <li><a href="pages/examples/profile.html"><i className="fa fa-circle-o"></i>
                                            Profile</a></li>
                                        <li><a href="pages/examples/login.html"><i className="fa fa-circle-o"></i> Login</a>
                                        </li>
                                        <li><a href="pages/examples/register.html"><i className="fa fa-circle-o"></i>
                                            Register</a></li>
                                        <li><a href="pages/examples/lockscreen.html"><i className="fa fa-circle-o"></i>
                                            Lockscreen</a></li>
                                        <li><a href="pages/examples/404.html"><i className="fa fa-circle-o"></i> 404
                                            Error</a></li>
                                        <li><a href="pages/examples/500.html"><i className="fa fa-circle-o"></i> 500
                                            Error</a></li>
                                        <li><a href="pages/examples/blank.html"><i className="fa fa-circle-o"></i> Blank
                                            Page</a></li>
                                        <li><a href="pages/examples/pace.html"><i className="fa fa-circle-o"></i> Pace
                                            Page</a></li>
                                    </ul>
                                </li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-share"></i> <span>Multilevel</span>
                                        <i className="fa fa-angle-left pull-right"></i>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="#"><i className="fa fa-circle-o"></i> Level One</a></li>
                                        <li>
                                            <a href="#"><i className="fa fa-circle-o"></i> Level One <i
                                                className="fa fa-angle-left pull-right"></i></a>
                                            <ul className="treeview-menu">
                                                <li><a href="#"><i className="fa fa-circle-o"></i> Level Two</a></li>
                                                <li>
                                                    <a href="#"><i className="fa fa-circle-o"></i> Level Two <i
                                                        className="fa fa-angle-left pull-right"></i></a>
                                                    <ul className="treeview-menu">
                                                        <li><a href="#"><i className="fa fa-circle-o"></i> Level
                                                            Three</a></li>
                                                        <li><a href="#"><i className="fa fa-circle-o"></i> Level
                                                            Three</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li><a href="#"><i className="fa fa-circle-o"></i> Level One</a></li>
                                    </ul>
                                </li>
                                <li><a href="documentation/index.html"><i className="fa fa-book"></i> <span>Documentation</span></a>
                                </li>
                                <li className="header">LABELS</li>
                                <li><a href="#"><i className="fa fa-circle-o text-red"></i> <span>Important</span></a>
                                </li>
                                <li><a href="#"><i className="fa fa-circle-o text-yellow"></i> <span>Warning</span></a>
                                </li>
                                <li><a href="#"><i className="fa fa-circle-o text-aqua"></i>
                                    <span>Information</span></a></li>
                            </ul>
                        </section>
                    </aside>

                    <div className="content-wrapper">
                        <section className="content-header">
                            <h1>
                                Dashboard
                                <small>Version 2.0</small>
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
                                            className="ion ion-ios-gear-outline"></i></span>

                                        <div className="info-box-content">
                                            <span className="info-box-text">CPU Traffic</span>
                                            <span className="info-box-number">90<small>%</small></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-xs-12">
                                    <div className="info-box">
                                        <span className="info-box-icon bg-red"><i
                                            className="fa fa-google-plus"></i></span>

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
                                            className="ion ion-ios-cart-outline"></i></span>

                                        <div className="info-box-content">
                                            <span className="info-box-text">Sales</span>
                                            <span className="info-box-number">760</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-xs-12">
                                    <div className="info-box">
                                        <span className="info-box-icon bg-yellow"><i
                                            className="ion ion-ios-people-outline"></i></span>

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
                            <b>Version</b> 2.3.3
                        </div>
                        <strong>Copyright &copy; 2014-2015 <a href="http://almsaeedstudio.com">Almsaeed
                            Studio</a>.</strong> All rights
                        reserved.
                    </footer>

                </div>
            </div>
        );
    }
});

module.exports = Admin;