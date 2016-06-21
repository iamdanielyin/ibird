/**
 * 登录组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;

const Signin = React.createClass({
    componentDidMount(){
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
    },
    render(){
        return (
            <div className="login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <Link to='/signin'>i<b>bird</b></Link>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">请填写以下信息登录</p>
                        <form action="#" method="post">
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="帐号"/>
                                <span className="fa fa-user form-control-feedback" aria-hidden="true"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="密码"/>
                                <span className="fa fa-lock form-control-feedback" aria-hidden="true"></span>
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox"/>
                                            <span>记住我</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <Link className="btn btn-primary btn-block btn-flat" to='/index'>登录</Link>
                                </div>
                            </div>
                        </form>

                        <div className="social-auth-links text-center">
                            <p>- 第三方登录 -</p>
                            <Link to='/signin' className="btn btn-block btn-social btn-facebook btn-flat"><i className="fa fa-facebook"></i> 使用Facebook帐号登录</Link>
                            <Link to='/signin' className="btn btn-block btn-social btn-google btn-flat"><i className="fa fa-google"></i> 使用Google帐号登录</Link>
                            <Link to='/signin' className="btn btn-block btn-social btn-github btn-flat"><i className="fa fa-github"></i> 使用Github帐号登录</Link>
                        </div>

                        <Link to='/forgot' className="text-center">忘记密码</Link><br/>
                        <Link to='/signup' className="text-center">注册新帐号</Link>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Signin;