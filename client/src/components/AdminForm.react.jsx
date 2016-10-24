/**
 * 表单组件:
 * 1.初始化表单
 * 2.表单验证
 * 3.响应表单操作
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const assign = require('object-assign');
const Link = require('react-router').Link;
const RouteUtils = require('../utils/RouteUtils');
const ToastrUtils = require('../utils/ToastrUtils');
const FormFactory = require('../utils/FormFactory');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('node-uuid');
const config = require('ibird.config');


const AdminForm = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {
            moduleCode: this.props.module,
            modelCode: this.props.model,
            i: this.props.i,
            data: {},
            identifiersData: {},
            config: config.models[this.props.module + '-' + this.props.model] || {}
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
        return this.props.module + '-' + this.props.model + '-' + (this.props.i ? this.props.i : '') + key;
    },
    mapSchemaObjKeys(callback){
        const schema = this.props.schema;
        if (!schema) return;
        const fields = schema.fields || {};
        Object.keys(fields).map(function (key) {
            if (!key || !fields[key].label) return;
            callback(key, fields[key]);
        });
    },
    createForm(){
        const self = this;
        const formGroupArray = [], identifiers = [];
        this.mapSchemaObjKeys(function (key, item) {
            const label = item.label;
            const display = item.display || {};
            if (display.form == false)return;
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            //TODO item.items代表表单项额外数据
            const identifier = self.getIdentifier(key);
            const formGroup = FormFactory(ctrltype, label, identifier, {
                items: item.items,
                page: (!item.items && item.ajax && (item.ajax.ref || item.ajax.url) && item.ajax.flag == 0)
            });
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
        const identifiersData = this.state.identifiersData;
        this.mapSchemaObjKeys(function (key, item) {
            if (!data[key]) return;
            const identifier = self.getIdentifier(key);
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            const refOptions = item.refOptions;
            const identifierData = identifiersData[identifier];
            let value = data[key];
            switch (ctrltype) {
                case 'boolean-checkbox':
                    if (!_.isArray(value)) value = value.split(',');
                    if (!item.items && (identifierData.ref || identifierData.url)) {
                        identifierData.selected = value;
                    } else {
                        $('.' + identifier).each(function () {
                            if (value.indexOf($(this).val()) == -1) return;
                            $(this).iCheck('check');
                        });
                    }
                    break;
                case 'boolean-radios':
                    if (!item.items && (identifierData.ref || identifierData.url)) {
                        identifierData.selected = value;
                        console.log(identifierData.selected);
                    } else {
                        $('.' + identifier).each(function () {
                            if (value.indexOf($(this).val()) == -1) return;
                            $(this).iCheck('check');
                        });
                    }
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
        if (_.keys(identifiersData).length > 1) this.setState({identifiersData: identifiersData});
    },
    getValue(){
        const self = this;
        const data = {};
        const identifiersData = this.state.identifiersData;
        this.mapSchemaObjKeys(function (key, item) {
            const identifier = self.getIdentifier(key);
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            const identifierData = identifiersData[identifier];
            let value = null;
            switch (ctrltype) {
                case 'boolean-checkbox':
                    value = [];
                    if (!item.items && (identifierData.ref || identifierData.url)) {
                        value = identifierData.selected;
                    } else {
                        $('.' + identifier).each(function () {
                            if ($(this).is(':checked') != true) return;
                            value.push($(this).val());
                        });
                    }
                    break;
                case 'boolean-radios':
                    if (!item.items && (identifierData.ref || identifierData.url)) {
                        value = identifierData.selected;
                    } else {
                        $('.' + identifier).each(function () {
                            if ($(this).is(':checked') != true) return;
                            value = $(this).val();
                        });
                    }
                    console.log(value);
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
        this.mapSchemaObjKeys(function (key, item) {
            if (!item.required || data[key]) return;
            const identifier = self.getIdentifier(key);
            let message = _.isString(item.required) ? item.required : '{PATH}不能为空';
            message = message.replace(/\{PATH\}/g, item.label);
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
            self.context.router.replace({
                pathname: "/home/" + self.props.module + "/" + self.props.path,
                query: {m: self.props.model},
                state: {
                    item: self.props.item
                }
            });
        });
    },
    ctrlKeyRegister(){
        const self = this;
        const identifiersData = {};
        this.mapSchemaObjKeys(function (key, item) {
            const label = item.label;
            const identifier = self.getIdentifier(key);
            let selector = $('#' + identifier);
            let identifierData = {};
            let ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            ctrltype = (ctrltype == 'ref' || ctrltype == 'refs') ? 'ref' : ctrltype;
            switch (ctrltype) {
                case 'date':
                    //日期
                    item.options = item.options ? (item.options.format || 'yyyy-mm-dd') : item.options;
                    selector.datetimepicker(item.options || {
                            language: 'zh-CN',
                            weekStart: 1,
                            todayBtn: 1,
                            autoclose: 1,
                            todayHighlight: 1,
                            startView: 2,
                            minView: 2,
                            forceParse: 1,
                            format: item.format || 'yyyy-mm-dd'
                        });
                    break;
                case 'time':
                    //时间
                    item.options = item.options ? (item.options.format || 'hh:ii:ss') : item.options;
                    selector.datetimepicker(item.options || {
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
                            format: item.format || 'hh:ii:ss'
                        });
                    break;
                case 'datetime':
                    //日期时间
                    item.options = item.options ? (item.options.format || 'yyyy-mm-dd hh:ii:ss') : item.options;
                    selector.datetimepicker(item.options || {
                            language: 'zh-CN',
                            weekStart: 1,
                            todayBtn: 1,
                            autoclose: 1,
                            todayHighlight: 1,
                            minuteStep: 1,
                            startView: 2,
                            forceParse: 1,
                            showMeridian: 1,
                            format: item.format || 'yyyy-mm-dd hh:ii:ss'
                        });
                    break;
                case 'boolean-radios':
                    selector = $('.' + identifier);
                    selector.iCheck({
                        radioClass: 'iradio_square-blue'
                    });
                    identifierData = assign({}, {
                        "data": [],
                        "totalelements": 0,
                        "flag": 0,
                        "keyword": '',
                        "start": 1,
                        "end": 1,
                        "page": 1,
                        "size": 30,
                        "totalpages": 1,
                        "selected": []
                    }, item.ajax);
                    if (!item.items && (identifierData.ref || identifierData.url)) {
                        self.simpleQuery(identifierData).then(res => res.json()).then(function (json) {
                            assign(identifierData, identifierData, json);
                            self.refreshiCheckOptions('radio', identifier, identifierData);
                        });
                    }
                    //分页注册
                    $('#' + identifier + '-prepage').click(function () {
                        const data = self.state.identifiersData[identifier];
                        if (!data.ref && !data.url) return;
                        if (data.page == 1) return toastr.info('已经是第一页了', null, ToastrUtils.defaultOptions);
                        data.page--;
                        self.simpleQuery(data).then(res => res.json()).then(function (json) {
                            assign(data, data, json);
                            self.refreshiCheckOptions('radio', identifier, data);
                            const identifiersData = self.state.identifiersData;
                            identifiersData[identifier] = data;
                            self.setState({identifiersData: identifiersData});
                        });
                    });
                    $('#' + identifier + '-nextpage').click(function () {
                        const data = self.state.identifiersData[identifier];
                        if (!data.ref && !data.url) return;
                        if (data.page >= data.totalpages) return toastr.info('已经是最后一页了', null, ToastrUtils.defaultOptions);
                        data.page++;
                        self.simpleQuery(data).then(res => res.json()).then(function (json) {
                            assign(data, data, json);
                            self.refreshiCheckOptions('radio', identifier, data);
                            const identifiersData = self.state.identifiersData;
                            identifiersData[identifier] = data;
                            self.setState({identifiersData: identifiersData});
                        });
                    });
                    break;
                case 'boolean-checkbox':
                    selector = $('.' + identifier);
                    selector.iCheck({
                        checkboxClass: 'icheckbox_square-blue'
                    });
                    identifierData = assign({}, {
                        "data": [],
                        "totalelements": 0,
                        "flag": 0,
                        "keyword": '',
                        "start": 1,
                        "end": 1,
                        "page": 1,
                        "size": 30,
                        "totalpages": 1,
                        "selected": []
                    }, item.ajax);
                    if (!item.items && (identifierData.ref || identifierData.url)) {
                        self.simpleQuery(identifierData).then(res => res.json()).then(function (json) {
                            assign(identifierData, identifierData, json);
                            self.refreshiCheckOptions('checkbox', identifier, identifierData);
                        });
                    }
                    //分页注册
                    $('#' + identifier + '-prepage').click(function () {
                        const data = self.state.identifiersData[identifier];
                        if (!data.ref && !data.url) return;
                        if (data.page == 1) return toastr.info('已经是第一页了', null, ToastrUtils.defaultOptions);
                        data.page--;
                        self.simpleQuery(data).then(res => res.json()).then(function (json) {
                            assign(data, data, json);
                            self.refreshiCheckOptions('checkbox', identifier, data);
                            const identifiersData = self.state.identifiersData;
                            identifiersData[identifier] = data;
                            self.setState({identifiersData: identifiersData});
                        });
                    });
                    $('#' + identifier + '-nextpage').click(function () {
                        const data = self.state.identifiersData[identifier];
                        if (!data.ref && !data.url) return;
                        if (data.page >= data.totalpages) return toastr.info('已经是最后一页了', null, ToastrUtils.defaultOptions);
                        data.page++;
                        self.simpleQuery(data).then(res => res.json()).then(function (json) {
                            assign(data, data, json);
                            self.refreshiCheckOptions('checkbox', identifier, data);
                            const identifiersData = self.state.identifiersData;
                            identifiersData[identifier] = data;
                            self.setState({identifiersData: identifiersData});
                        });
                    });

                    break;
                case 'ref':
                    const refOptions = item.refOptions;
                    const refModuleCode = item.ref.substring(0, item.ref.indexOf('-'));
                    const refModelCode = item.ref.substring(item.ref.indexOf('-') + 1);
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
            identifiersData[identifier] = identifierData;
        });
        this.setState({identifiersData: identifiersData});
    },
    simpleQuery(ajax) {
        let url = ajax.ref ? RouteUtils.CUSTOM('/' + ajax.ref.split('-').join('/')) : ajax.url;
        const method = (ajax.ref ? 'GET' : (ajax.method || 'POST').toUpperCase());
        const data = _.omit(ajax, (ajax.filter || []), ['data', 'filter', 'method']);
        if (!url || !method || !data) return;
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "access_token": this.state.access_token
            }
        };
        if (['GET'].indexOf(method) != -1) {
            url += '?' + qs.stringify(data);
        } else {
            options.body = JSON.stringify(data);
        }
        return fetch(url, options);
    },
    refreshiCheckOptions(type, identifier, ajax, append){
        const self = this;
        const identifiersData = self.state.identifiersData;
        if (!type || !ajax || !_.isArray(ajax.data) || !ajax.value || !ajax.display) return;
        const $array = [];
        ajax.data.forEach(function (item) {
            if (!item || !item[ajax.value] || !item[ajax.display]) return;
            const $label = `<label style="margin-right:5px">
                        <input type="${type}" class="${identifier}" name="${identifier}" value="${item[ajax.value]}" id="${identifier + '-' + item[ajax.value]}"/>
                        <span>${item[ajax.display]}</span>
                    </label>`;
            $array.push($label);
        });
        if (!append) $('#' + identifier + '-box').empty();//清空子元素
        $('#' + identifier + '-box').append($array.join(''));//添加子元素
        //样式注册
        $('.' + identifier).iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
        //注册选中/取消选中事件
        $('.' + identifier).on('ifChecked', function (event) {
            const id = $(this).attr('value');
            if (!id) return;
            const data = identifiersData[identifier];
            if ('checkbox' == type) {
                if (data.selected.indexOf(id) != -1) return;
                data.selected.push(id);
                data.selected = _.uniq(data.selected);
            } else {
                data.selected = id;
            }
            self.setState({identifiersData: identifiersData});
        });
        $('.' + identifier).on('ifUnchecked', function (event) {
            const id = $(this).attr('value');
            if (!id) return;
            const data = identifiersData[identifier];
            if ('checkbox' == type) {
                if (data.selected.indexOf(id) == -1) return;
                data.selected.splice(data.selected.indexOf(id), 1);
                data.selected = _.uniq(data.selected);
            } else {
                data.selected = '';
            }
            self.setState({identifiersData: identifiersData});
        });
        //更新当前界面的选中项
        console.log(ajax.selected);
        const selectors = _.isArray(ajax.selected) ? ajax.selected.map(item => '#' + identifier + '-' + item) : ['#' + identifier + '-' + ajax.selected];
        if (selectors.length > 0) $(selectors.join(',')).iCheck('check');
    },
    render(){
        const self = this;
        const formGroupArray = this.state.form;
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">
                                <span>{this.props.schema.label}</span>
                                <small style={{color: '#B1A9A9'}}>{this.props.i}</small>
                            </h3>
                        </div>
                        <form role="form">
                            <div className="box-body">
                                {formGroupArray}
                            </div>
                            <div className="box-footer">
                                <span className="btn btn-primary" onClick={this._onSaveAction}
                                      style={{cursor: 'pointer', margin: '0px 5px'}}>保存</span>

                                <Link className="btn btn-default" to={{
                                    pathname: "/home/" + this.props.module + "/" + this.props.path,
                                    query: {m: this.props.model},
                                    state: {
                                        item: this.props.item
                                    }
                                }}>返回</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminForm;