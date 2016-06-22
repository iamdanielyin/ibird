/**
 * 注册组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const RouteUtils = require('../utils/RouteUtils');
const CodeUtils = require('../utils/CodeUtils');
const toastr = require('toastr');
const ToastrUtils = require('../utils/ToastrUtils');

const Signup = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return {cp: JSON.parse(CodeUtils.decodeBase64(localStorage.getItem('C_P'), 5)), agree: false}
    },
    componentDidMount(){
        $('#signup-agreement').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
        $('#signup-agreement').on('ifToggled', this._onAgreementChange);
    },
    _onValidate(){
        const self = this;
        const code = this.refs.code;
        const email = this.refs.email;
        const password = this.refs.password;
        const confirm = this.refs.confirm;
        const agree = this.state.agree;
        if (!code.value) {
            toastr.error('用户名不能为空', null, ToastrUtils.defaultOptions);
            return code.focus();
        }
        if (!password.value) {
            toastr.error('密码不能为空', null, ToastrUtils.defaultOptions);
            return password.focus();
        }
        if (password.value !== confirm.value) {
            toastr.error('两次密码不一致', null, ToastrUtils.defaultOptions);
            return confirm.focus();
        }
        if (agree != true) return toastr.error('请仔细阅读并同意用户协议', null, ToastrUtils.defaultOptions);
        fetch(RouteUtils.SIGNUP, {
            method: "POST",
            body: JSON.stringify({code: code.value, email: email.value, password: password.value}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            code.value = null;
            email.value = null;
            password.value = null;
            confirm.value = null;
            toastr.info('注册成功', null, ToastrUtils.defaultOptions);
        });
    },
    _onAgreementChange(){
        this.setState({agree: !this.state.agree});
    },
    render(){
        const self = this;
        const name = this.state.cp.name == 'ibird' ? <span>i<b>bird</b></span> : <span>{this.state.cp.name}</span >;
        return (
            <div className="register-page">
                <div className="register-box">
                    <div className="register-logo">
                        <Link to='/signup'>{name}</Link>
                    </div>

                    <div className="register-box-body">
                        <p className="login-box-msg">请认真填写以下信息注册</p>

                        <form action="#" method="post">
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="用户名" ref="code"/>
                                <span className="fa fa-user form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="输入密码" ref="password"/>
                                <span className="fa fa-lock form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="确认密码" ref="confirm"/>
                                <span className="fa fa-lock form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="email" className="form-control" placeholder="邮箱" ref="email"/>
                                <span className="fa fa-envelope form-control-feedback"></span>
                            </div>


                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox" id="signup-agreement"/> 我同意 <Link to='/signup'>《ibird用户协议》</Link>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <span type="submit" className="btn btn-primary btn-block btn-flat"
                                          onClick={self._onValidate}>注册</span>
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