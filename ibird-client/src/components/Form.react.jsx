/**
 * ibird表单组件
 * Created by yinfxs on 16-12-17.
 */

const React = require('react');
const assign = require('object-assign');
const ToastrUtils = require('ToastrUtils');
const RouteUtils = require('RouteUtils');
const FormFactory = require('FormFactory');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');

const Form = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const token = JSON.parse(localStorage.getItem('access_token') || '{}');
        return {
            data: {},
            identifiersData: {},
            editors: [],
            id: uuid.v1().replace(/-/g, ''),
            token: token,
            access_token: token.access_token
        };
    },
    getIdentifier(key){
        if (!key) return null;
        return `${this.state.id}-${key}`;
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
        const formGroupArray = [];
        this.mapSchemaObjKeys(function (key, item) {
            const label = item.label;
            const display = item.display || {};
            if (display.form == false)return;
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            //TODO item.items代表表单项额外数据
            const identifier = self.getIdentifier(key);
            const formGroup = FormFactory.get(ctrltype, label, identifier, {
                items: item.items,
                page: (!item.items && item.ajax && (item.ajax.ref || item.ajax.url) && item.ajax.flag == 0),
                disabled: item.disabled || false
            });
            formGroupArray.push(formGroup);
        });
        this.setState({form: formGroupArray});
        return formGroupArray;
    },
    formGeneration(){
        const schema = this.props.schema;
        if (!schema) return;
        this.createForm();//构建表单
        const setValue = this.props.setValue;
        const data = _.isFunction(setValue) ? setValue() : setValue;
        this.setState({data: data || {}}, () => this.refreshCtrls());
    },
    componentWillMount(){
        this.formGeneration();
    },
    componentDidMount(){
        $("input").iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
        this.ctrlKeyRegister();
    },
    componentWillUnmount(){
        const editors = this.state.editors;
        if (!_.isArray(editors)) return;
        editors.forEach(editor => editor.destroy());
    },
    setValue(data){
        this.setState({data: data || {}}, () => this.refreshCtrls());
    },
    refreshCtrls(){
        const self = this;
        const data = this.state.data || {};
        const identifiersData = this.state.identifiersData;
        this.mapSchemaObjKeys(function (key, item) {
            const identifier = self.getIdentifier(key);
            if ('password' == item.ctrltype) $(`#${identifier}`).attr('disabled', data._id ? true : false);
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            const refOptions = item.refOptions;
            const identifierData = identifiersData[identifier] || {};
            let value = data[key] || '';
            switch (ctrltype) {
                case 'editor':
                    const editor = identifierData.editor;
                    // 初始化编辑器的内容
                    if (editor) editor.$txt.html(value);
                    break;
                case 'boolean-checkbox':
                    $(`.${identifier}`).iCheck('uncheck');
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
                    $(`.${identifier}`).iCheck('uncheck');
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
                    $('#' + identifier).val(value || '');
                    break;
            }
        });
        if (_.keys(identifiersData).length > 1) this.setState({identifiersData: identifiersData});
    },
    getValue(){
        const self = this;
        const data = {};
        const identifiersData = this.state.identifiersData;
        this.mapSchemaObjKeys((key, item) => {
            const identifier = self.getIdentifier(key);
            const ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            const identifierData = identifiersData[identifier];
            let value = null;
            switch (ctrltype) {
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
        return assign(this.state.data, data);
    },
    validate(data){
        if (!data) return false;
        const self = this;
        const messageArray = [];
        this.mapSchemaObjKeys(function (key, item) {
            if (!item.required || data[key]) return;
            const identifier = self.getIdentifier(key);
            if (item.disabled == true) return;
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
        const back = e.target.getAttribute('data-back');
        const schema = this.props.schema;
        if (!schema) return;
        const data = this.getValue();
        if (this.validate(data) != true) return;
        if (!_.isFunction(this.props.getValue)) return;
        this.props.getValue(data);
    },
    _onClearAction(e){
        this.setValue();
    },
    ctrlKeyRegister(){
        const self = this;
        const identifiersData = {};
        const editors = this.state.editors || [];
        this.mapSchemaObjKeys(function (key, item) {
            const label = item.label;
            const identifier = self.getIdentifier(key);
            let selector = $('#' + identifier);
            let identifierData = {};
            let ctrltype = item.ctrltype ? item.ctrltype.toLowerCase() : 'string';
            ctrltype = (ctrltype == 'ref' || ctrltype == 'refs') ? 'ref' : ctrltype;
            const disabled = item.disabled || false;
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
                            assign(data, json);
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
                            assign(data, json);
                            self.refreshiCheckOptions('checkbox', identifier, data);
                            const identifiersData = self.state.identifiersData;
                            identifiersData[identifier] = data;
                            self.setState({identifiersData: identifiersData});
                        });
                    });
                    //辅助选择按钮注册
                    $('#' + identifier + '-select-display').click(function () {
                        //选择显示
                        $(`.${identifier}`).iCheck('check');
                    });
                    $('#' + identifier + '-select-invert').click(function () {
                        //反选显示
                        $(`.${identifier}`).iCheck('toggle');
                    });
                    $('#' + identifier + '-select-clear').click(function () {
                        //清空显示
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
                        minimumInputLength: 1,
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
    refreshiCheckOptions(type, identifier, ajax, append){
        const self = this;
        const identifiersData = self.state.identifiersData;
        if (!type || !ajax || !_.isArray(ajax.data) || !ajax.display) return;
        ajax.value = ajax.value || '_id';
        const $array = [];
        ajax.data.forEach(function (item) {
            if (!item || !item[ajax.value]) return;
            const display = ajax.template ? self.paramsTemplatebuild(ajax.template, item) : item[ajax.display];
            if (!display) return;
            const $label = `<label style="margin-right:5px">
                        <input type="${type}" class="${identifier}" name="${identifier}" value="${item[ajax.value]}" id="${identifier + '-' + item[ajax.value]}"/>
                        <span>${display}</span>
                    </label>`;
            $array.push($label);
        });
        if (!append) $('#' + identifier + '-box').empty();//清空子元素
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
    },
    render(){
        const schema = this.props.schema;
        const view = this.props.view;
        const formGroups = this.state.form;
        return (
            <div className="box box-solid" style={{display: (view == 1 || view == 2) ? 'block' : 'none'}}>
                <div className="box-header with-border"
                     style={{display: schema.label ? 'block' : 'none'}}>{schema.label}</div>
                <div className="box-body">
                    <div role="form">
                        {formGroups}
                    </div>
                </div>
                <div className="box-footer">
                    <div className="btn-group">
                        <button type="button" className="btn btn-sm btn-info"
                                onClick={this._onSaveAction}>保存
                        </button>
                        <button type="button" className="btn btn-sm btn-default"
                                onClick={this._onClearAction}>清空
                        </button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Form;