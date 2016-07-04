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
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({data: json}, () => self.setValue());
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
        const formGroupArray = [], identifiers = [];
        this.mapSchemaObjKeys(function (key, obj) {
            if (!key || !obj[key].label) return;
            const item = obj[key];
            const label = item.label;
            const inputType = item.inputType ? item.inputType.toLowerCase() : 'string';
            //TODO item.items代表表单项额外数据
            const identifier = self.getIdentifier(key);
            const formGroup = FormFactory(inputType, label, identifier, item.items);
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
        this.setValue();
    },
    setValue(){
        if (!this.state.data) return;
        const self = this;
        const data = this.state.data;
        this.mapSchemaObjKeys(function (key, obj) {
            if (!key || !obj[key].label || !data[key]) return;
            const item = obj[key];
            const identifier = self.getIdentifier(key);
            const inputType = item.inputType ? item.inputType.toLowerCase() : 'string';
            const value = data[key];
            const refOptions = item.refOptions;
            switch (inputType) {
                case 'boolean-checkbox':
                    if (!_.isArray(value)) return;
                    $('.' + identifier).each(function () {
                        if (value.indexOf($(this).val()) == -1) return;
                        $(this).iCheck('check');
                    });
                    break;
                case 'boolean-radios':
                    $('.' + identifier).each(function () {
                        if (value.indexOf($(this).val()) == -1) return;
                        $(this).iCheck('check');
                    });
                    break;
                case 'file':
                    $('#' + identifier + '-preview').attr('src', value);
                    break;
                case 'files':
                    if (!_.isArray(value)) return;
                    value.map(function (url) {
                        const $img = $("<img/>").attr({'width': '150', src: url}).css({
                            'margin': '2px',
                            'max-width': '100%'
                        });
                        $('#' + identifier + '-previews').append($img);
                    });
                    break;
                case 'ref':
                    const $option = $('<option selected></option>').val(value[refOptions.value]).text(value[refOptions.display]);
                    $('#' + identifier).append($option).trigger('change');
                    break;
                case 'refs':
                    if (!_.isArray(value)) return;
                    value.map(function (valueItem) {
                        const $options = $('<option selected></option>').val(valueItem[refOptions.value]).text(valueItem[refOptions.display]);
                        $('#' + identifier).append($options).trigger('change');
                    });
                    break;
                default:
                    $('#' + identifier).val(value);
                    break;
            }
        });
    },
    getValue(){
        const self = this;
        const data = {};
        this.mapSchemaObjKeys(function (key, obj) {
            if (!key || !obj[key].label) return;
            const item = obj[key];
            const identifier = self.getIdentifier(key);
            const inputType = item.inputType ? item.inputType.toLowerCase() : 'string';
            let value = null;
            switch (inputType) {
                case 'boolean-checkbox':
                    value = [];
                    $('.' + identifier).each(function () {
                        if ($(this).is(':checked') != true) return;
                        value.push($(this).val());
                    });
                    break;
                case 'boolean-radios':
                    $('.' + identifier).each(function () {
                        if ($(this).is(':checked') != true) return;
                        value = $(this).val();
                    });
                    break;
                default:
                    value = $('#' + identifier).val();
                    break;
            }
            data[key] = value;
        });
        return data;
    },
    validate(data){
        if (!data) return false;
        const self = this;
        const messageArray = [];
        this.mapSchemaObjKeys(function (key, obj) {
            if (!key || !obj[key].label || (!obj[key].required || data[key])) return;
            const identifier = self.getIdentifier(key);
            let message = _.isString(obj[key].required) ? obj[key].required : '{PATH}不能为空';
            message = message.replace(/\{PATH\}/g, obj[key].label);
            if ($('#' + identifier).focus) $('#' + identifier).focus();
            messageArray.push(message);
        });
        if (messageArray.length == 0) return true;
        messageArray.map((message) => (toastr.error(message, null, ToastrUtils.defaultOptions)));
        return false;
    },
    _onSaveAction(e){
        const self = this;
        const data = this.getValue();
        if (this.validate(data) != true) return;
        const body = !this.state.i ? data : {cond: {_id: this.state.i}, doc: data};
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode), {
            method: (!this.state.i ? 'POST' : 'PUT'),
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            toastr.info((!self.state.i ? '新增成功' : '修改成功'), null, ToastrUtils.defaultOptions);
        });
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
                    const refModuleCode = item.ref.substring(0, item.ref.indexOf('_'));
                    const refModelCode = item.ref.substring(item.ref.indexOf('_') + 1);
                    selector.select2({
                        language: 'zh-CN',
                        placeholder: label,
                        minimumInputLength: 1,
                        ajax: {
                            url: RouteUtils.CUSTOM('/' + refModuleCode + '/' + refModelCode),
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
                case 'file':
                    $('#' + identifier).popover({
                        title: item.label,
                        html: true,
                        content: '<div class="btn-group" style="max-height:35px; height:35px;">' +
                        '<div class="btn btn-default btn-sm fileinput-button" style="position:relative;">' +
                        '<i class="glyphicon glyphicon-plus"></i>' +
                        '<span id="' + identifier + '-text">选择文件</span>' +
                        '<input type="file" id="' + identifier + '-file" class="form-control" style="opacity:0;position:absolute;left:0px;top:0px"/>' +
                        '</div>' +
                        '<span id="' + identifier + '-upload" class="btn btn-primary btn-sm fa fa-cloud-upload" aria-hidden="true" style="line-height:18px; cursor: pointer;"></span>' +
                        '<span id="' + identifier + '-clear" class="btn btn-danger btn-sm fa fa-times" aria-hidden="true" style="line-height:18px; cursor: pointer;"></span>' +
                        '</div>' +
                        '<div style="width:100%;"><img id="' + identifier + '-preview" class="img-responsive img-thumbnail" width="150" style="display: none;"/></div>',
                        placement: 'auto top'
                    });
                    $('#' + identifier).on('shown.bs.popover', function (e) {
                        $('#' + identifier + '-file').fileupload({
                            url: RouteUtils.CUSTOM('/upload'),
                            type: 'POST',
                            dataType: 'json',
                            autoUpload: false,
                            add: function (e, data) {
                                const object = {};
                                object[identifier + '-data'] = data;
                                self.setState(object);
                                $('#' + identifier + '-text').text('已选择1个文件');
                            },
                            done: function (e, data) {
                                //文件上传成功后的通知
                                const result = data ? data.result : null;
                                if (!result || result.length < 1) return toastr.error('上传失败', null, ToastrUtils.defaultOptions);
                                $('#' + identifier + '-preview').attr('src', result[0]).css('display', 'block');
                            }
                        });

                        $('#' + identifier + '-upload').click(function (e) {
                            //执行上传
                            const data = self.state[identifier + '-data'];
                            if (!data) return toastr.warning('请先选择文件', null, ToastrUtils.defaultOptions);
                            data.submit();
                        });
                        $('#' + identifier + '-clear').click(function () {
                            //执行清除
                            const object = {};
                            object[identifier + '-data'] = null;
                            self.setState(object);
                            $('#' + identifier + '-text').text('选择文件');
                        });
                    });
                    $('#' + identifier).on('hide.bs.popover', function (e) {
                        const val = $('#' + identifier + '-preview').attr('src');
                        if (val) $(e.target).val(val);
                    });
                    break;
                case 'files':
                    $('#' + identifier).popover({
                        title: item.label,
                        html: true,
                        content: '<div class="btn-group" style="max-height:35px; height:35px;">' +
                        '<div class="btn btn-default btn-sm fileinput-button" style="position:relative;">' +
                        '<i class="glyphicon glyphicon-plus"></i>' +
                        '<span id="' + identifier + '-text">选择文件</span>' +
                        '<input type="file" id="' + identifier + '-file" class="form-control" style="opacity:0;position:absolute;left:0px;top:0px" multiple/>' +
                        '</div>' +
                        '<span id="' + identifier + '-upload" class="btn btn-primary btn-sm fa fa-cloud-upload" aria-hidden="true" style="line-height:18px; cursor: pointer;"></span>' +
                        '<span id="' + identifier + '-clear" class="btn btn-danger btn-sm fa fa-times" aria-hidden="true" style="line-height:18px; cursor: pointer;"></span>' +
                        '</div>' +
                        '<div style="width:100%; max-height:200px;" id="' + identifier + '-preview" class="scrollbar"></div>',
                        placement: 'auto top'
                    });
                    $('#' + identifier).on('shown.bs.popover', function (e) {
                        $('#' + identifier + '-file').fileupload({
                            url: RouteUtils.CUSTOM('/upload'),
                            type: 'POST',
                            singleFileUploads: false,
                            limitMultiFileUploads: 10,
                            limitMultiFileUploadSize: 524288000,//500M
                            dataType: 'json',
                            autoUpload: false,
                            add: function (e, data) {
                                const array = self.state[identifier + '-datas'] || [];
                                const object = {};
                                let length = 0;
                                array.push(data);
                                object[identifier + '-datas'] = array;
                                self.setState(object);
                                array.map(function (item) {
                                    length += item.files.length;
                                });
                                $('#' + identifier + '-text').text('已选择' + length + '个文件');
                            },
                            done: function (e, data) {
                                //文件上传成功后的通知
                                const result = data ? data.result : null;
                                if (!result || result.length < 1) return toastr.error('上传失败', null, ToastrUtils.defaultOptions);
                                result.map(function (url) {
                                    const $img = $('<img src="' + url + '" class="img-responsive img-thumbnail" width="150" style="display: inline-block; margin: 3px;"/>');
                                    $('#' + identifier + '-preview').append($img);
                                });
                            }
                        });

                        $('#' + identifier + '-upload').click(function (e) {
                            //执行上传
                            const datas = self.state[identifier + '-datas'];
                            if (!datas || datas.length == 0) return toastr.warning('请先选择文件', null, ToastrUtils.defaultOptions);
                            datas.map(function (data) {
                                if (!data) return;
                                data.submit();
                            });
                        });
                        $('#' + identifier + '-clear').click(function () {
                            //执行清除
                            const object = {};
                            object[identifier + '-datas'] = [];
                            self.setState(object);
                            $('#' + identifier + '-text').text('选择文件');
                        });
                    });
                    $('#' + identifier).on('hide.bs.popover', function (e) {
                        let val = '';
                        $('#' + identifier + '-preview > img').each(function () {
                            val += $(this).attr('src') + ',';
                        });
                        val = val.lastIndexOf(',') != -1 ? val.substring(0, val.length - 1) : val;
                        if (val) $(e.target).val(val);
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
                                <span className="btn btn-primary" onClick={this._onSaveAction}
                                      style={{cursor:'pointer'}}>保存</span>
                                <span className="btn btn-default" style={{cursor:'pointer'}} id="ibird-files-center">文件管理</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminForm;