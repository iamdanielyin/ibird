/**
 * 表单组件:
 * 1.初始化表单
 * 2.表单验证
 * 3.响应表单操作
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const RouteUtils = require('../utils/RouteUtils');
const ToastrUtils = require('../utils/ToastrUtils');
const FormUtils = require('../utils/FormUtils');
const _ = require('underscore');
const qs = require('qs');
const uuid = require('node-uuid');


const AdminForm = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {
            moduleCode: this.props.module,
            modelCode: this.props.model,
            i: this.props.i,
            data: {}
        };
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        state.token = token;
        state.access_token = token.access_token;
        return state;
    },
    fetchData(){
        const self = this;
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode + '/' + self.state.i), {
            headers: {
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({data: json});
        });
    },
    createForm(){
        const obj = this.props.schema ? this.props.schema.obj : {};
        const formGroupArray = [];
        Object.keys(obj).map(function (key) {
            if (!key || !obj[key].label) return;
            const item = obj[key];
            const label = item.label;
            const inputType = item.inputType ? item.inputType.toLowerCase() : 'string';
            let formGroup = null;
            switch (inputType) {
                case 'string':
                    //文本框
                    formGroup = FormUtils.string(label);
                    break;
                case 'password':
                    //密码框
                    formGroup = FormUtils.password(label);
                    break;
                case 'date':
                    //日期
                    formGroup = FormUtils.date(label);
                    break;
                case 'time':
                    //时间
                    formGroup = FormUtils.time(label);
                    break;
                case 'datetime':
                    //日期时间
                    formGroup = FormUtils.datetime(label);
                    break;
                case 'boolean-radios':
                    //单选
                    formGroup = FormUtils['boolean-radios'](label, item.items);
                    break;
                case 'boolean-checkbox':
                    //多选
                    formGroup = FormUtils['boolean-checkbox'](label, item.items);
                    break;
                case 'number':
                    //数字
                    formGroup = FormUtils.number(label);
                    break;
                case 'textarea':
                    //编辑器
                    formGroup = FormUtils.textarea(label);
                    break;
                case 'ref':
                    //单引用
                    formGroup = FormUtils.ref(label);
                    break;
                case 'refs':
                    //多引用
                    formGroup = FormUtils.refs(label);
                    break;
                case 'file':
                    //单文件/图片
                    formGroup = FormUtils.file(label);
                case 'files':
                    //多文件/图片
                    formGroup = FormUtils.files(label);
                default:
                    //文本框
                    break;
            }
            formGroupArray.push(formGroup);
        });
        this.setState({form: formGroupArray});
        return formGroupArray;

    },
    componentWillMount(){
        this.createForm();
        if (this.state.i) this.fetchData();
    },
    componentDidMount(){
        this.globalRegister();
    },
    globalRegister(){
        //日期时间
        $('.ibird-form-datetime').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            minuteStep: 1,
            startView: 2,
            forceParse: 1,
            showMeridian: 1,
            format: 'yyyy-mm-dd hh:ii:ss'
        });
        //日期
        $('.ibird-form-date').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 1,
            format: 'yyyy-mm-dd'
        });
        //时间
        $('.ibird-form-time').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            minuteStep: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: 1,
            format: 'hh:ii:ss'
        });
        $('.ibird-form-radios').iCheck({
            radioClass: 'iradio_square-blue'
        });
        $('.ibird-form-checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue'
        });
        $('.ibird-form-ref').select2({
            language: 'zh-CN'
        });
        $('.ibird-form-refs').select2({
            language: 'zh-CN'
        });
    },
    render(){
        const formGroupArray = this.state.form;
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">
                                <span>{this.props.schema.label}</span>
                                <small style={{color:'#B1A9A9'}}>{this.props.i}</small>
                            </h3>
                        </div>
                        <form role="form">
                            <div className="box-body">
                                {formGroupArray}
                            </div>
                            <div className="box-footer">
                                <button type="submit" className="btn btn-primary">保存</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminForm;