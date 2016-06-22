/**
 * 注册组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;

const Signup = React.createClass({
    componentDidMount(){
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
    },
    render(){
        return (
            <div className="register-page">
                <div className="register-box">
                    <div className="register-logo">
                        <Link to='/signup'>i<b>bird</b></Link>
                    </div>

                    <div className="register-box-body">
                        <p className="login-box-msg">请认真填写以下信息注册</p>

                        <form action="#" method="post">
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="用户名"/>
                                <span className="fa fa-user form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="email" className="form-control" placeholder="邮箱"/>
                                <span className="fa fa-envelope form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="输入密码"/>
                                <span className="fa fa-lock form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="确认密码"/>
                                <span className="fa fa-lock form-control-feedback"></span>
                            </div>


                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox"/> 我同意 <Link to='/signup'>《ibird用户协议》</Link>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">注册</button>
                                </div>
                            </div>
                        </form>
                        <Link to='/signin' className="text-center">直接登录</Link>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Signup;