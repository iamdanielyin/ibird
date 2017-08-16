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
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const FormFactory = require('FormFactory');
const _ = require('lodash');
const moment = require('moment');
const qs = require('qs');
const uuid = require('uuid');
const config = require('ibird.config');


const Form = require('./Form.react');
const Table = require('./Table.react');
const SubemaCtrl = require('./SubemaCtrl.react');


const AdminForm = React.createClass({
    contextTypes: {
        router: React.PropTypes.object,
        location: React.PropTypes.object
    },
    getInitialState(){
        const token = JSON.parse(localStorage.getItem('access_token') || '{}');
        const location = this.context.location || {};
        const state = location.state || {};
        const query = location.query || {};
        token.data = token.data || {};
        const models = config.models || {};
        const modelConfig = models[this.props.module + '-' + this.props.model] || {};
        const hooksAll = modelConfig.hooks || {};
        const key = this.props.module + '-' + this.props.model;
        const schema = this.props.schema;

        return {
            moduleCode: this.props.module,
            modelCode: this.props.model,
            authPrefix: `${this.props.module}_${this.props.model}_`,
            i: (this.props.i || ''),
            data: {org: token.data.org},
            identifiersData: {},
            config: modelConfig,
            hooks: hooksAll.form || {},
            editors: [],
            subemas: [],
            key: key,
            token: token,
            access_token: token.access_token,
            roles: token.data.roles,
            org: token.data.org,
            view: schema.singleton == true ? 1 : query.view
        };
    },
    assignContext(){
        return {RouteUtils: RouteUtils, ToastrUtils: ToastrUtils};
    },
    componentWillReceiveProps: function (nextProps) {
        //onleave
        if (_.isFunction(this.state.hooks['onleave'])) {
            //调用加载后函数
            this.state.hooks['onleave'](assign({$this: this}, this.assignContext()));
        }
        const self = this;
        const models = config.models || {};
        const modelConfig = models[nextProps.module + '-' + nextProps.model] || {};
        const hooksAll = modelConfig.hooks || {};
        const key = this.props.module + '-' + this.props.model;
        const location = this.context.location || {};
        const state = location.state || {};
        const query = location.query || {};
        const schema = this.props.schema;
        this.setState({
            moduleCode: nextProps.module,
            modelCode: nextProps.model,
            authPrefix: `${nextProps.module}_${nextProps.model}_`,
            i: (nextProps.i || ''),
            data: {},
            identifiersData: {},
            config: modelConfig,
            hooks: hooksAll.form || {},
            customToolbarViews: [],
            editors: [],
            subemas: [],
            key: key,
            view: schema.singleton == true ? 1 : query.view
        }, function () {
            self.formGeneration();
        });
    },
    fetchData(callback){
        const schema = this.props.schema;
        const self = this;
        const query = qs.stringify({access_token: this.state.access_token});
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode + '/' + (schema.singleton == true ? uuid.v1() : self.state.i)) + '?' + query)
            .then(res => res.json()).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            if (!json || _.keys(json).length == 0) return;
            if (!json || _.keys(json).length == 0) return;
            const state = {data: json};
            state.i = json[schema._id || '_id'] || self.state.i;
            this.setState(state, () => {
                this.refreshCtrls();
                if (_.isFunction(callback)) callback();
            });
        });
    },
    getIdentifier(key){
        if (!key) return null;
        return this.props.module + '-' + this.props.model + '-' + (this.props.i ? this.props.i : '') + '-' + key;
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
    formGeneration(){
        const self = this;
        const schema = this.props.schema;
        if (!schema) return;

        const viewAuth = `${this.state.authPrefix}form_view`;
        if (this.state.roles.indexOf(viewAuth) == -1) {
            toastr.error('无界面访问权限', null, assign({}, ToastrUtils.defaultOptions, {
                progressBar: true,
                preventDuplicates: true,
                timeOut: 2000
            }));
            this.context.router.replace('/home/404');
        }

        this.createForm();//构建表单
        if (this.state.i || true == schema.singleton) {
            //修改操作
            const editAuth = `${this.state.authPrefix}form_edit`;
            if (this.state.roles.indexOf(editAuth) == -1) return this.authError();
            if (schema.update == false) {
                toastr.warning('抱歉，禁止编辑操作', null, ToastrUtils.defaultOptions);
                if (true == schema.singleton) return;
                return this.context.router.replace('/home/' + this.props.module + '/' + this.props.path);
            }
            this.fetchData();//获取数据
        } else {
            //新增操作
            const addAuth = `${this.state.authPrefix}form_add`;
            if (this.state.roles.indexOf(addAuth) == -1) return this.authError();
            if (schema.add == false) {
                toastr.warning('抱歉，禁止新增操作', null, ToastrUtils.defaultOptions);
                return this.context.router.replace('/home/' + this.props.module + '/' + this.props.path);
            }
        }
    },
    authError(){
        toastr.error('无界面访问权限，自动跳转到主页', null, assign({}, ToastrUtils.defaultOptions, {
            progressBar: true,
            preventDuplicates: true,
            timeOut: 2000
        }));
        this.context.router.replace('/home/404');
    },
    createForm(){
        const self = this;
        const schema = this.props.schema;
        const view = this.state.view;
        const partsauth = schema.partsauth;
        const formGroupArray = [], identifiers = [], subemas = [];
        this.mapSchemaObjKeys((key, item) => {
            const label = item.label;
            const display = item.display || {};
            if (display.form == false) return;
            if (item.disabled && !this.state.i) return;
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            //TODO item.items代表表单项额外数据
            const identifier = self.getIdentifier(key);
            //过滤字段权限
            if (partsauth == true) {
                const viewAuth = `${this.state.authPrefix}fields_${key}_read_form`;
                if (this.state.roles.indexOf(viewAuth) == -1) return;
            }
            let formGroup;
            if ('subema' == ctrltype) {
                if (!_.isArray(item.subema) || item.subema.length == 0) return;
                const schema = {fields: item.subema[0]};
                subemas.push({schema: schema, label: label, identifier: identifier});
            } else {
                let disabled = item.disabled || false;
                if (partsauth == true) {
                    const viewAuth = `${this.state.authPrefix}fields_${key}_write`;
                    if (this.state.roles.indexOf(viewAuth) == -1) disabled = true;
                }
                //检查表单状态
                disabled = (view == 1 || view == 2) ? disabled : true;
                formGroup = FormFactory.get(ctrltype, label, identifier, {
                    key: key,
                    items: item.items,
                    page: (!item.items && item.ajax && (item.ajax.ref || item.ajax.url) && item.ajax.flag == 0),
                    ajax: item.ajax,
                    disabled: disabled,
                    subema: item.subema,
                    item: item
                })
            }
            formGroupArray.push(formGroup);
        });
        this.setState({form: formGroupArray, subemas: subemas});
        return formGroupArray;

    },
    componentWillMount(){
        this.formGeneration();
    },
    componentDidMount(){
        $(":checkbox").iCheck({
            checkboxClass: 'icheckbox_square-blue'
        });
        $(":radio").iCheck({
            radioClass: 'iradio_square-blue'
        });
        this.ctrlKeyRegister();
        this.refreshCtrls();
        //onload
        if (_.isFunction(this.state.hooks['onload'])) {
            //调用加载后函数
            this.state.hooks['onload'](assign({$this: this}, this.assignContext()));
        }
    },
    componentWillUnmount(){
        const editors = this.state.editors;
        if (!_.isArray(editors)) return;
        editors.forEach(editor => editor.destroy());
        //onleave
        if (_.isFunction(this.state.hooks['onleave'])) {
            //调用加载后函数
            this.state.hooks['onleave'](assign({$this: this}, this.assignContext()));
        }
    },
    setValue(data){
        this.setState({data: data || {}}, () => this.refreshCtrls());
    },
    refreshCtrls(){
        const self = this;
        const data = this.state.data || {};
        const identifiersData = this.state.identifiersData;
        this.mapSchemaObjKeys((key, item) => {
            const identifier = self.getIdentifier(key);
            // if ('password' == item.ctrltype) $(`#${identifier}`).attr('disabled', data._id ? true : false);
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            const refOptions = item.refOptions;
            const identifierData = identifiersData[identifier] || {};
            let value = (ctrltype != 'number' && !_.isNumber(data[key])) ? (data[key] || '') : data[key];

            value = value && ['created', 'modified'].indexOf(key) != -1 ? moment(value, 'x').format('YYYY-MM-DD HH:mm:ss') : value;
            switch (ctrltype) {
                case 'editor':
                    const editor = identifierData.editor;
                    // 初始化编辑器的内容
                    if (editor) editor.$txt.html(value);
                    break;
                case 'subema':
                    this.refs[identifier].setValue(value);
                    break;
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
                    } else {
                        $('.' + identifier).each(function () {
                            if (value.indexOf($(this).val()) == -1) return;
                            $(this).iCheck('check');
                        });
                    }
                    break;
                case 'ref':
                    //TODO ref.display
                    const display = value[refOptions.display];
                    const template = refOptions.template ? self.paramsTemplatebuild(refOptions.template, value) : null;
                    const $option = $('<option selected></option>').val(value[refOptions.value]).text(template || display);
                    $('#' + identifier).append($option).trigger('change');
                    break;
                case 'refs':
                    if (!_.isArray(value)) return;
                    value.map(function (valueItem) {
                        const display = valueItem[refOptions.display];
                        const template = refOptions.template ? self.paramsTemplatebuild(refOptions.template, valueItem) : null;
                        const $options = $('<option selected></option>').val(valueItem[refOptions.value]).text(template || display);
                        $('#' + identifier).append($options).trigger('change');
                    });
                    break;
                default:
                    $('#' + identifier).val(value);
                    break;
            }
        });
        //TODO
        if (_.keys(identifiersData).length > 1) this.setState({identifiersData: identifiersData});
    },
    getValue(){
        const self = this;
        const data = {};
        const identifiersData = this.state.identifiersData;
        this.mapSchemaObjKeys((key, item) => {
            if (['created', 'creater', 'modified', 'modifier', 'dr'].indexOf(key) != -1) return;
            const identifier = self.getIdentifier(key);
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            const identifierData = identifiersData[identifier];
            let value = null;
            switch (ctrltype) {
                case 'subema':
                    value = this.refs[identifier].getValue();
                    break;
                case 'editor':
                    const editor = identifierData.editor;
                    if (editor) value = editor.$txt.html();
                    break;
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
                    break;
                default:
                    value = $('#' + identifier).val() || '';
                    break;
            }
            data[key] = value;
        });
        const result = assign({}, this.state.data, data);
        return result;
    },
    validate(data){
        if (!data) return false;
        const self = this;
        const messageArray = [];
        this.mapSchemaObjKeys(function (key, item) {
            if (!item.required || data[key]) return;
            const identifier = self.getIdentifier(key);
            if (item.disabled == true) return;
            if (self.state.i && item.ctrltype == 'password') return;
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
        const back = e.target.getAttribute('data-back');
        const schema = this.props.schema;
        if (!schema) return;
        if (schema.add == false || schema.update == false) {
            toastr.warning('抱歉，禁止编辑操作', null, ToastrUtils.defaultOptions);
            if (true == schema.singleton) return;
            return this.context.router.replace('/home/' + this.props.module + '/' + this.props.path);
        }
        const data = this.getValue();
        const cond = {};
        cond[schema._id || '_id'] = this.state.i;
        if (this.validate(data) != true) return;
        const body = !this.state.i ? data : {cond: cond, doc: data};
        const query = qs.stringify({access_token: this.state.access_token});
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode) + '?' + query, {
            method: (!this.state.i ? 'POST' : 'PUT'),
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            let message = !self.state.i ? '新增成功' : '修改成功';
            toastr.success((true == schema.singleton ? '保存成功' : message), null, ToastrUtils.defaultOptions);
            if (true == schema.singleton) {
                json = _.isArray(json) && json.length > 0 ? json[0] : json;
                return self.setState({i: json._id}, () => self.fetchData());//获取数据
            }
            if (!back) return;
            //返回列表
            self.context.router.replace({
                pathname: "/home/" + self.props.module + "/" + self.props.path,
                query: {m: self.props.model},
                state: {
                    item: self.props.item
                }
            });
        });
    },
    _onBackAction(e){
        const schema = this.props.schema;
        if (!schema) return;
        if (true == schema.singleton) return;
        this.context.router.replace({
            pathname: "/home/" + this.props.module + "/" + this.props.path,
            query: {m: this.props.model},
            state: {
                item: this.props.item
            }
        });
    },
    ctrlKeyRegister(){
        const self = this;
        const identifiersData = {};
        const view = this.state.view;
        const editors = this.state.editors || [];
        this.mapSchemaObjKeys(function (key, item) {
            const label = item.label;
            const identifier = self.getIdentifier(key);
            let selector = $('#' + identifier);
            let identifierData = {};
            let ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            ctrltype = (ctrltype == 'ref' || ctrltype == 'refs') ? 'ref' : ctrltype;
            let disabled = item.disabled || false;
            disabled = (view == 1 || view == 2) || view == 2 ? disabled : true;
            switch (ctrltype) {
                case 'editor':
                    //编辑器
                    wangEditor.config.printLog = false;
                    const editor = new wangEditor(selector[0]);
                    editor.config.mapAk = '5A0w90fxrRBksVmuyZy7aBl1YZlhh10Y';
                    editor.config.uploadImgUrl = RouteUtils.CUSTOM('/upload');
                    editor.config.printLog = false;
                    editor.config.uploadImgFileName = 'files';
                    editor.config.uploadParams = {
                        image_source: 'editor'
                    };
                    editor.create();
                    if (disabled == true) editor.disable();
                    identifierData = assign({}, {
                        "editor": editor
                    });
                    editors.push(editor);
                    break;
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
                            autoclose: 1,
                            todayHighlight: 1,
                            minuteStep: 1,
                            startView: 1,
                            minView: 0,
                            maxView: 1,
                            forceParse: 1,
                            todayBtn: false,
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
                    if (disabled == true) selector.iCheck('disable');
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
                            self.refreshiCheckOptions('radio', identifier, identifierData, item);
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
                            self.refreshiCheckOptions('radio', identifier, data, item);
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
                            self.refreshiCheckOptions('radio', identifier, data, item);
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
                    if (disabled == true) selector.iCheck('disable');
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
                            self.refreshiCheckOptions('checkbox', identifier, identifierData, item);
                        });
                    }
                    //分页注册
                    $('#' + identifier + '-prepage').click(function () {
                        const data = self.state.identifiersData[identifier];
                        if (!data.ref && !data.url) return;
                        if (data.page == 1) return toastr.info('已经是第一页了', null, ToastrUtils.defaultOptions);
                        data.page--;
                        self.simpleQuery(data).then(res => res.json()).then(function (json) {
                            assign(data, json);
                            self.refreshiCheckOptions('checkbox', identifier, data, item);
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
                            assign(data, json);
                            self.refreshiCheckOptions('checkbox', identifier, data, item);
                            const identifiersData = self.state.identifiersData;
                            identifiersData[identifier] = data;
                            self.setState({identifiersData: identifiersData});
                        });
                    });
                    //辅助选择按钮注册
                    $('#' + identifier + '-select-display').click(function () {
                        //选择显示
                        if (disabled) return;
                        $(`.${identifier}`).iCheck('check');
                    });
                    $('#' + identifier + '-select-invert').click(function () {
                        //反选显示
                        if (disabled) return;
                        $(`.${identifier}`).iCheck('toggle');
                    });
                    $('#' + identifier + '-select-clear').click(function () {
                        //清空显示
                        if (disabled) return;
                        $(`.${identifier}`).iCheck('uncheck');
                    });
                    break;
                case 'ref':
                    const refOptions = item.refOptions;
                    const refModuleCode = item.ref.substring(0, item.ref.indexOf('-'));
                    const refModelCode = item.ref.substring(item.ref.indexOf('-') + 1);
                    const query = qs.stringify({access_token: self.state.access_token});
                    selector.select2({
                        allowClear: true,
                        language: 'zh-CN',
                        placeholder: label,
                        minimumInputLength: 0,
                        ajax: {
                            url: RouteUtils.CUSTOM('/' + refModuleCode + '/' + refModelCode) + '?' + query,
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
                            },
                            processResults: function (json, params) {
                                if (json.err) {
                                    toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
                                    return {
                                        results: []
                                    }
                                }
                                const resultArray = [];
                                json.data.map(function (object) {
                                    const value = object[refOptions.value];
                                    const display = object[refOptions.display];
                                    const template = refOptions.template ? self.paramsTemplatebuild(refOptions.template, object) : null;
                                    if (!value || (!display && !template)) return;
                                    resultArray.push({id: value, text: template || display});
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
        this.setState({identifiersData: identifiersData, editors: editors});
    },
    simpleQuery(ajax) {
        let url = ajax.ref ? RouteUtils.CUSTOM('/' + ajax.ref.split('-').join('/')) : ajax.url;
        const method = (ajax.ref ? 'GET' : (ajax.method || 'POST').toUpperCase());
        const data = _.omit(ajax, (ajax.filter || []), ['data', 'filter', 'method']);
        data.access_token = this.state.access_token;
        if (!url || !method || !data) return;
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        };
        if (['GET'].indexOf(method) != -1) {
            url += '?' + qs.stringify(data);
        } else {
            options.body = JSON.stringify(data);
        }
        return fetch(url, options);
    },
    getTemplateVars(content){
        if (!content) return content;
        const vars = [];
        const split = content.split('$');
        split.forEach((item) => {
            if (!item) return;
            const start = item.indexOf('{');
            const end = item.indexOf('}');
            if (start == -1 || end == -1) return;
            const key = item.substring(start + 1, end).trim();
            if (!key) return;
            vars.push(key);
        });
        return vars;
    },
    paramsTemplatebuild(content, vars){
        if (!content || !vars) return content;
        if (!(_.isObject(vars) && !_.isArray(vars))) return;
        //文本替换
        _.keys(vars).map(function (key) {
            if (!key) return;
            content = content.replace(new RegExp('\\${\\s*' + key + '\\s*}', 'g'), vars[key]);
        });
        return content;
    },
    groupOptions(){

    },
    refreshiCheckOptions(type, identifier, ajax, item){
        const self = this;
        const group = ajax.group;
        const view = this.state.view;
        const identifiersData = self.state.identifiersData;
        if (!type || !ajax || !_.isArray(ajax.data) || !ajax.display) return;
        ajax.value = ajax.value || '_id';
        const $array = [];
        const colClass = `col-xs-12 col-sm-3 col-md-3`;
        const groupIds = [];
        if (!group) {
            ajax.data.forEach(function (item) {
                if (!item || !item[ajax.value]) return;
                const display = ajax.template ? self.paramsTemplatebuild(ajax.template, item) : item[ajax.display];
                if (!display) return;
                const $label = `<label style="margin-right:5px" class="${colClass}">
                        <input type="${type}" class="${identifier}" name="${identifier}" value="${item[ajax.value]}" id="${identifier + '-' + item[ajax.value]}"/>
                        <span>${display}</span>
                    </label>`;
                $array.push($label);
            });
        } else {
            const groups = {};
            ajax.data.forEach(item => {
                const key = item[group];
                const array = groups[key] || [];
                array.push(item);
                groups[key] = array;
            });
            _.keys(groups).forEach(title => {
                let data = groups[title];
                const groupId = uuid.v1().replace(/-/g, '');
                groupIds.push(groupId);
                const fieldset = [];
                data = _.sortBy(data, '-name -code');
                data.forEach(item => {
                    if (!item || !item[ajax.value]) return;
                    const display = ajax.template ? self.paramsTemplatebuild(ajax.template, item) : item[ajax.display];
                    if (!display) return;
                    const $label = `<label style="margin-right:5px" class="${colClass}">
                        <input type="${type}" class="${identifier} ${groupId}" name="${identifier}" value="${item[ajax.value]}" id="${identifier + '-' + item[ajax.value]}"/>
                        <span>${display}</span>
                    </label>`;
                    fieldset.push($label);
                });
                const buttons = `<div class="btn-group btn-group-xs">
                                    <button type="button" class="btn btn-default" id="${groupId}-select-display">
                                        <i class="fa fa-check-square-o" aria-hidden="true"></i>
                                        <span style="margin-left: 2px;">组内全选</span>
                                    </button>
                                    <button type="button" class="btn btn-default" id="${groupId}-select-invert">
                                        <i class="fa fa-minus-square" aria-hidden="true"></i>
                                        <span style="margin-left: 2px;">组内反选</span>
                                    </button>
                                    <button type="button" class="btn btn-default" id="${groupId}-select-clear">
                                        <i class="fa fa-square-o" aria-hidden="true"></i>
                                        <span style="margin-left: 2px;">组内清空</span>
                                    </button>
                                </div>`;
                $array.push(`<fieldset><legend>${title}</legend>${buttons}<div class="row">${fieldset.join('')}</div></fieldset>`);

            });
        }
        $('#' + identifier + '-box').empty();//清空子元素
        $('#' + identifier + '-box').append($array.join(''));//添加子元素

        //设置分页信息
        $('#' + identifier + '-page').text('分页：' + ajax.page + '/');//当前页
        $('#' + identifier + '-totalpages').text(ajax.totalpages);//总页
        $('#' + identifier + '-totalelements').text('每页' + ajax.size + '条，共' + ajax.totalelements + '条');//总记录数

        //样式注册
        $('.' + identifier).iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
        let disabled = item.disabled;
        disabled = !(view == 1 || view == 2) ? true : disabled;
        if (disabled) $('.' + identifier).iCheck('disable');
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
        const selectors = _.isArray(ajax.selected) ? ajax.selected.map(item => '#' + identifier + '-' + item) : ['#' + identifier + '-' + ajax.selected];
        if (selectors.length > 0) $(selectors.join(',')).iCheck('check');

        //添加组内选择
        for (const groupId of groupIds) {
            $(`#${groupId}-select-display`).unbind('click').bind('click', () => {
                $(`.${groupId}`).iCheck('check');
            });
            $(`#${groupId}-select-invert`).unbind('click').bind('click', () => {
                $(`.${groupId}`).iCheck('toggle');
            });
            $(`#${groupId}-select-clear`).unbind('click').bind('click', () => {
                $(`.${groupId}`).iCheck('uncheck');
            });
        }
    },
    _onRefreshAction(){
        this.fetchData(() => toastr.success('刷新成功', null, ToastrUtils.defaultOptions));
    },
    render(){
        const self = this;
        const schema = this.props.schema;
        const subemas = this.state.subemas || [];
        const formGroupArray = this.state.form;
        const config = this.state.config || {};
        const view = this.state.view;
        return (
            <div
                className={`row ibird-form ibird-form-${this.state.moduleCode}-${this.state.modelCode}-${this.props.i ? 'edit' : 'add'}`}>
                <div className={`col-xs-12`}>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">
                                <span>{this.props.schema.label}</span>
                                <small style={{color: '#B1A9A9'}}>{this.state.i}</small>
                            </h3>
                            <div className="box-tools">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-primary" onClick={this._onRefreshAction}
                                            style={{display: this.props.i ? 'inline-block' : 'none'}}>
                                        <i className="fa fa-refresh"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <form role="form">
                            <div className="box-body">
                                {formGroupArray}
                                {/*{subemas.map((item, i) => {*/}
                                    {/*if (!item || !item.schema || !item.identifier) return;*/}
                                    {/*return <SubemaCtrl key={i} schema={item.schema} ref={item.identifier}*/}
                                                       {/*view={view}*/}
                                                       {/*label={item.label}/>*/}
                                {/*})}*/}
                            </div>
                            <div className="box-footer">
                                <button type="button" className="btn btn-primary" onClick={this._onSaveAction}
                                        data-back="1"
                                        style={{
                                            margin: '0px 5px',
                                            display: (view == 1 || view == 2) ? 'inline-block' : 'none'
                                        }}>保存并返回
                                </button>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-primary"
                                            onClick={this._onSaveAction}
                                            style={{display: (view == 1 || view == 2) ? 'inline-block' : 'none'}}>
                                        保存
                                    </button>
                                    <button type="button" className="btn btn-default"
                                            style={{
                                                display: true == schema.singleton ? 'none' : 'inline-block'
                                            }}
                                            onClick={this._onBackAction}>返回
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminForm;