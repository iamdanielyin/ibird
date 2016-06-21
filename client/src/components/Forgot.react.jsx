/**
 * 忘记密码组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;

const Forgot = React.createClass({
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
                        <Link to='/signin'>i<b>bird</b></Link>
                    </div>

                    <div className="register-box-body">
                        <p className="login-box-msg">请填写注册邮箱接收验证码</p>

                        <form action="#" method="post">
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="用户名"/>
                                <span className="fa fa-user form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="email" className="form-control" placeholder="邮箱"/>
                                <span className="fa fa-envelope form-control-feedback"></span>
                            </div>


                            <div className="row">
                                <div className="col-xs-12">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">接收验证码</button>
                                </div>
                            </div>
                        </form>
                        <Link to='/signin' className="text-center">返回登录</Link><br/>
                        <Link to='/signup' className="text-center">注册新帐号</Link>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Forgot;