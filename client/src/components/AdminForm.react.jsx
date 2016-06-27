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
const FormFactory = require('../utils/FormFactory');
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
    getIdentifier(key){
        if (!key) return null;
        //identifier = id = ref = moduleCode-modelCode[-_id]-xxx
        return this.props.module + '-' + this.props.model + '-' + (this.props.i ? '-' + this.props.i : '') + key;
    },
    mapSchemaObjKeys(callback){
        const schema = this.props.schema;
        if (!schema) return;
        const obj = schema.obj || {};
        Object.keys(obj).map(function (key) {
            callback(key, obj);
        });
    },
    createForm(){
        const self = this;
        const formGroupArray = [];
        this.mapSchemaObjKeys(function (key, obj) {
            if (!key || !obj[key].label) return;
            const item = obj[key];
            const label = item.label;
            const inputType = item.inputType ? item.inputType.toLowerCase() : 'string';
            //TODO item.items代表表单项额外数据
            const formGroup = FormFactory(inputType, label, self.getIdentifier(key), item.items);
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
        this.ctrlKeyRegister();
    },
    ctrlKeyRegister(){
        const self = this;
        this.mapSchemaObjKeys(function (key, obj) {
            if (!key || !obj[key].label) return;
            const item = obj[key];
            const label = item.label;
            const identifier = self.getIdentifier(key);
            let selector = $('#' + identifier);
            let inputType = item.inputType ? item.inputType.toLowerCase() : 'string';
            inputType = (inputType == 'ref' || inputType == 'refs') ? 'ref' : inputType;
            switch (inputType) {
                case 'date':
                    //日期
                    selector.datetimepicker({
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
                    break;
                case 'time':
                    //时间
                    selector.datetimepicker({
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
                    break;
                case 'datetime':
                    //日期时间
                    selector.datetimepicker({
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
                    break;
                case 'boolean-radios':
                    selector = $('.' + identifier);
                    selector.iCheck({
                        radioClass: 'iradio_square-blue'
                    });
                    break;
                case 'boolean-checkbox':
                    selector = $('.' + identifier);
                    selector.iCheck({
                        checkboxClass: 'icheckbox_square-blue'
                    });
                    break;
                case 'ref':
                    const refOptions = item.refOptions;
                    selector.select2({
                        language: 'zh-CN',
                        placeholder: label,
                        minimumInputLength: 1,
                        ajax: {
                            url: RouteUtils.CUSTOM('/' + self.props.module + '/' + item.ref),
                            data: function (params) {
                                const query = qs.stringify({
                                    keyword: params.term,
                                    page: params.page,
                                    size: params.size || 10
                                });
                                return query;
                            },
                            dataType: 'json',
                            beforeSend: function (request) {
                                request.setRequestHeader("access_token", self.state.access_token);
                            },
                            processResults: function (json, params) {
                                const resultArray = [];
                                json.data.map(function (object) {
                                    const value = object[refOptions.value];
                                    const display = object[refOptions.display];
                                    if (!value || !display) return;
                                    resultArray.push({id: value, text: display});
                                });
                                return {
                                    results: resultArray,
                                    pagination: {
                                        more: (json.page * json.size) < json.totalelements,
                                        page: json.page,
                                        size: json.size
                                    }
                                };
                            }
                        }
                    });
                    break;
            }
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