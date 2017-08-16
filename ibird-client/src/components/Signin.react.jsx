/**
 * 登录组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const _ = require('lodash');
const assign = require('object-assign');
const Link = require('react-router').Link;
const RouteUtils = require('RouteUtils');
const CodeUtils = require('CodeUtils');
const toastr = require('toastr');
const ToastrUtils = require('ToastrUtils');

const Signin = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const remeber = localStorage.getItem('remeber');
        return {
            cp: JSON.parse(CodeUtils.decodeBase64(localStorage.getItem('C_P'), 5)),
            remeber: remeber == 'true' ? true : false
        }
    },
    componentDidMount(){
        toastr.info('欢迎来到登录界面', null, ToastrUtils.defaultOptions);
        $('#signin-remeber').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
        $('#signin-remeber').on('ifToggled', this._onRemeberChange);
        if (this.state.remeber) {
            $('#signin-remeber').iCheck('check');
            this.refs.username.value = localStorage.getItem('username');
        }
    },
    _onValidate(){
        const self = this;
        const username = this.refs.username;
        const password = this.refs.password;
        const remeber = this.state.remeber;
        if (!username.value) {
            toastr.error('用户名不能为空', null, ToastrUtils.defaultOptions);
            return username.focus();
        }
        if (!password.value) {
            toastr.error('密码不能为空', null, ToastrUtils.defaultOptions);
            return password.focus();
        }
        toastr.info('执行登录中，请稍后...', null, assign({}, ToastrUtils.defaultOptions, {
            progressBar: false,
            preventDuplicates: true,
            timeOut: 600,
            positionClass: "toast-top-center"
        }));
        fetch(RouteUtils.SIGNIN, {
            method: "POST",
            body: JSON.stringify({username: username.value, password: password.value}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            this.clearAllPagingParams();
            localStorage.setItem('C_V', CodeUtils.encodeBase64(JSON.stringify(json.configs.private), 5));
            localStorage.setItem('username', username.value);
            localStorage.setItem('remeber', remeber == true ? 'true' : 'false');
            localStorage.setItem('access_token', JSON.stringify(json));
            return self.context.router.push('/home');
        });
    },
    clearAllPagingParams(){
        const storage = localStorage;
        _.keys(storage).forEach(key => {
            if (!key || !key.endsWith('pagingParams')) return;
            localStorage.removeItem(key);
        });
    },
    _onRemeberChange(){
        this.setState({remeber: !this.state.remeber});
    },
    render(){
        const self = this;
        const name = this.state.cp.name == 'ibird' ? <span>i<b>bird</b></span> : <span>{this.state.cp.name}</span >;
        return (
            <div className="login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <Link to='/signin'>{name}</Link>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">请填写以下信息登录</p>
                        <form action="#" method="post">
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="帐号" ref="username"/>
                                <span className="fa fa-user form-control-feedback" aria-hidden="true"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="密码" ref="password"/>
                                <span className="fa fa-lock form-control-feedback" aria-hidden="true"></span>
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox" id="signin-remeber"/>
                                            <span>记住我</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <span className="btn btn-primary btn-block btn-flat" onClick={self._onValidate}>
                                        登录
                                    </span>
                                </div>
                            </div>
                        </form>

                        <div className="social-auth-links text-center" style={{display: 'none'}}>
                            <p>- 第三方登录 -</p>
                            <Link to='/signin' className="btn btn-block btn-social btn-facebook btn-flat"><i
                                className="fa fa-facebook"></i> 使用Facebook帐号登录</Link>
                            <Link to='/signin' className="btn btn-block btn-social btn-google btn-flat"><i
                                className="fa fa-google"></i> 使用Google帐号登录</Link>
                            <Link to='/signin' className="btn btn-block btn-social btn-github btn-flat"><i
                                className="fa fa-github"></i> 使用Github帐号登录</Link>
                        </div>

                        <Link to='/forgot' className="text-center" style={{display: 'none'}}>忘记密码</Link><br/>
                        <Link to='/signup' className="text-center" style={{display: 'none'}}>注册新帐号</Link>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Signin;