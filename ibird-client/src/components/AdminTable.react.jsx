/**
 * 列表页面组件：
 * 1.初始化表格
 * 2.响应表格操作
 *    分页展示
 *    切换每页条数
 *    快速查询
 *    字段排序
 *    新增跳转
 *    编辑跳转
 *    删除
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const assign = require('object-assign');
const Link = require('react-router').Link;
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const _ = require('lodash');
const qs = require('qs');
const moment = require('moment');
const uuid = require('uuid');
const config = require('ibird.config');
const loading = require('../public/images/loading.gif');

const AdminTable = React.createClass({
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
        const pagingParams = JSON.parse(localStorage.getItem(`${this.props.module}_${this.props.model}_pagingParams`) || '{}') || {};
        return {
            pagingParams: pagingParams,
            colsTh: [],
            colsOrder: [],
            moduleCode: this.props.module,
            modelCode: this.props.model,
            authPrefix: `${this.props.module}_${this.props.model}_`,
            path: this.props.path,
            queryPlaceholder: '',
            actions: {},
            trs: [],
            delIdArray: [],
            config: modelConfig,
            hooks: hooksAll.list || {},
            customToolbarViews: [],
            exports: {},
            token: token,
            access_token: token.access_token,
            roles: token.data.roles,
            org: token.data.org,
            defviews: []
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
        const pagingParams = JSON.parse(localStorage.getItem(`${nextProps.module}_${nextProps.model}_pagingParams`) || '{}') || {};
        this.setState({
            pagingParams: pagingParams,
            colsTh: [],
            colsOrder: [],
            moduleCode: nextProps.module,
            modelCode: nextProps.model,
            authPrefix: `${nextProps.module}_${nextProps.model}_`,
            path: this.props.path,
            queryPlaceholder: '',
            actions: {},
            trs: [],
            delIdArray: [],
            config: modelConfig,
            hooks: hooksAll.list || {},
            customToolbarViews: [],
            exports: {},
            defviews: []
        }, function () {
            self.tableGeneration();
        });
    },
    componentDidUpdate: function (prevProps, prevState) {
        //P.S：因为Table的Header是动态生成的，所以才需要在这里初始化选择框列，而且其他和动态部分相关的注册也需要在这里做
        this.tableSelectItem();
    },
    selectedIds: [],
    tableSelectItem(){
        $('.ibird-table-select-all').iCheck({
            checkboxClass: 'icheckbox_square-blue'
        }).on('ifToggled', (e => {
            const checked = $('.ibird-table-select-all').is(':checked') == true;
            $('.ibird-table-select-item').iCheck(checked ? 'check' : 'uncheck');
            this.selectedIds = checked ? this.getSelectedIds() : [];
            // $('.ibird-table-selectedIds').text(this.selectedIds.length == 0 ? '' : `(已选中${this.selectedIds.length}行)`);
        }));
        $(".ibird-table-select-item").iCheck({
            checkboxClass: 'icheckbox_square-blue'
        }).on('ifToggled', (e => {
            const $this = $(e.target);
            const _id = $this.attr('id');
            const checked = $this.is(':checked') == true;
            const selectedIds = this.selectedIds;
            if (checked) {
                selectedIds.push(_id);
                _.uniq(selectedIds);
            } else {
                if (selectedIds.indexOf(_id) != -1) {
                    selectedIds.splice(selectedIds.indexOf(_id), 1);
                }
            }
            this.selectedIds = selectedIds;
            $('.ibird-table-selectedIds').text(selectedIds.length == 0 ? '' : `(已选中${selectedIds.length}行)`);
        }));
        this.refs.keyword.value = this.state.pagingParams.keyword || '';
    },
    componentWillMount(){
        this.tableGeneration();
    },
    componentDidMount(){
        $(":checkbox").iCheck({
            checkboxClass: 'icheckbox_square-blue'
        });
        $(":radio").iCheck({
            radioClass: 'iradio_square-blue'
        });
        $('#downloadModal-dataRange-all, #downloadModal-fileType-excel').iCheck('check');
        //弹出框的相关设置
        $('#uploadModal').on('shown.bs.modal', function (e) {
            this.refs['ibird-table-export-template'].value = '1';
        }.bind(this));
        $('#downloadModal').on('shown.bs.modal', function (e) {
            this.refs['ibird-table-export-template'].value = '0';
        }.bind(this));
    },
    componentWillUnmount(){
        //onleave
        if (_.isFunction(this.state.hooks['onleave'])) {
            //调用加载后函数
            this.state.hooks['onleave'](assign({$this: this}, this.assignContext()));
        }
    },
    tableGeneration(){
        const schema = this.props.schema;
        const viewAuth = `${this.state.authPrefix}list_ui_view`;
        if (this.state.roles.indexOf(viewAuth) == -1) return this.authError();
        //onload
        if (_.isFunction(this.state.hooks['onload'])) {
            //调用加载后函数
            this.state.hooks['onload'](assign({$this: this}, this.assignContext()), () => {
                console.log('加载后回调...');
                this.createTableHeader();
                this.fetchModelData();
            });
        } else {
            this.createTableHeader();
            this.fetchModelData();
        }
        if (schema.query && schema.query.fast) {
            const queryPlaceholder = [];
            const fast = schema.query.fast;
            const fields = schema.fields;
            fast.split(',').forEach(item => {
                if (!item || !fields[item]) return;
                queryPlaceholder.push(fields[item].label || item);
            });
            this.setState({queryPlaceholder: queryPlaceholder.join('、')});
        }
    },
    authError(){
        toastr.error('无界面访问权限', null, assign({}, ToastrUtils.defaultOptions, {
            progressBar: true,
            preventDuplicates: true,
            timeOut: 2000
        }));
        this.context.router.replace('/home/404');
    },
    fetchModelData(refresh){
        if (!this.state.moduleCode || !this.state.modelCode) return;
        const self = this;
        const pagingParams = this.state.pagingParams;
        const query = qs.stringify({
            page: pagingParams.page > 1 ? pagingParams.page : 1,
            size: pagingParams.size,
            sort: pagingParams.sort,
            cond: pagingParams.cond,
            keyword: pagingParams.keyword,
            access_token: this.state.access_token
        });
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode) + '?' + query).then(function (res) {
            return res.json();
        }).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            assign(pagingParams, json);
            self.setState({pagingParams: pagingParams});
            self.refreshTableRows();
            localStorage.setItem(`${this.state.moduleCode}_${this.state.modelCode}_pagingParams`, JSON.stringify(pagingParams));
            if (refresh == 1) {
                toastr.info('刷新数据成功！', null, ToastrUtils.defaultOptions);
            }
        });
    },
    createTableHeader(){
        const self = this;
        const schema = this.props.schema;
        const partsauth = schema.partsauth;
        const pagingParams = this.state.pagingParams;
        const fieldConfigs = this.state.config.fields || {};
        const fields = schema.fields || {};
        const colsTh = [], colsOrder = [], columns = [];
        colsTh.push(<th key={uuid.v4()}><input type="checkbox" className='ibird-table-select-all'
                                               style={{opacity: '0'}}/></th>);
        colsTh.push(<th key={uuid.v4()} style={{minWidth: '50px', width: '50px'}}>序号</th>);
        Object.keys(fields).map((key) => {
            const display = fields[key].display || {};
            if (!fields[key] || !fields[key].label || ['files', 'textarea', 'editor', 'password', 'subema'].indexOf(fields[key].ctrltype) != -1 || display.table == false) return;
            //过滤字段权限
            if (partsauth == true) {
                const viewAuth = `${this.state.authPrefix}fields_${key}_read_table`;
                if (this.state.roles.indexOf(viewAuth) == -1) return;
            }
            const fieldConfig = fieldConfigs[key] || {};
            if (fieldConfig.authid && self.state.roles.indexOf(fieldConfig.authid) == -1) return;
            const label = fieldConfig.label || fields[key].label;

            let icon = null;
            if (key == pagingParams.sort) {
                icon = <i data-code={key} className="fa fa-sort-asc" aria-hidden="true"></i>;
            } else if ('-' + key == pagingParams.sort) {
                icon = <i data-code={key} className="fa fa-sort-desc" aria-hidden="true"></i>;
            }

            colsTh.push(
                <th style={{cursor: 'pointer', minWidth: '80px', width: '100%'}} onClick={self._onSortAction}
                    data-code={key}
                    key={key}>{fieldConfig.column && _.isFunction(fieldConfig.column) ? fieldConfig.column(assign({
                    $this: self,
                    key: key,
                    data: label
                }, self.assignContext())) : label} {icon}</th>
            );
            colsOrder.push(key);
            columns.push({data: key});
        });
        colsTh.push(<th key={uuid.v4()} style={{
            minWidth: '120px',
            width: '100%'
        }}>操作</th>);
        this.setState({
            colsTh: colsTh,
            colsOrder: colsOrder,
            columns: columns,
            trs: [<tr key={uuid.v4()}>
                <td colSpan={colsOrder.length + 2}><img src={loading} height='100%'/></td>
            </tr>]
        });

    },
    _onSortAction(e){
        const code = e.target.getAttribute('data-code');
        if (!code) return;
        const pagingParams = this.state.pagingParams;
        pagingParams.sort = (pagingParams.sort != code) ? code : '-' + code;

        this.setState({pagingParams: pagingParams}, () => {
            this.createTableHeader();
            this.fetchModelData();
        });
    },
    _onSizeChange(e){
        if (!e.target.value) return;
        const pagingParams = this.state.pagingParams;
        pagingParams.size = e.target.value;
        this.setState({pagingParams: pagingParams}, () => setTimeout(() => this.fetchModelData()));
    },
    _onPageChange(e){
        if (!e.target.value) return;
        const pagingParams = this.state.pagingParams;
        pagingParams.page = e.target.value;
        this.setState({pagingParams: pagingParams}, () => setTimeout(() => this.fetchModelData()));
    },
    _onPreviousAction(e){
        const pagingParams = this.state.pagingParams;
        if (pagingParams.page <= 1) return toastr.info((pagingParams.totalpages == 1) ? '只有一页' : '已是第一页', null, ToastrUtils.defaultOptions);
        pagingParams.page--;
        this.setState({pagingParams: pagingParams}, () => this.fetchModelData());
    },
    _onNextAction(e){
        const pagingParams = this.state.pagingParams;
        if (pagingParams.page >= pagingParams.totalpages) return toastr.info((pagingParams.totalpages == 1) ? '只有一页' : '已是最后一页', null, ToastrUtils.defaultOptions);
        pagingParams.page++;
        this.setState({pagingParams: pagingParams}, () => this.fetchModelData());
    },
    _onKeywordAction(){
        const pagingParams = this.state.pagingParams;
        pagingParams.page = 1;
        pagingParams.keyword = this.refs.keyword.value;
        this.setState({pagingParams: pagingParams}, () => this.fetchModelData());
    },
    _onRefreshAction(){
        this.fetchModelData(1);
    },
    _defActions(e){
        const actions = this.state.actions;
        const aid = e.target.getAttribute('data-aid') || e.target.parentNode.getAttribute('data-aid');

        console.log('_defActions...', aid);
        if (!aid || !actions[aid] || !_.isFunction(actions[aid].action)) return;
        actions[aid].action(assign({$this: this, data: actions[aid].data, e: e}, this.assignContext()));
    },
    _onRowClick(e){
        const _id = e.target.getAttribute('data-id') || e.target.parentNode.getAttribute('data-id');
        if (!_id) return;
        $('#' + _id).iCheck('toggle');
    },
    _onRowDoubleClick(e){
        const _id = e.target.getAttribute('data-id') || e.target.parentNode.getAttribute('data-id');
        if (!_id) return;
        const addAuth = `${this.state.authPrefix}form_view`;
        if (this.state.roles.indexOf(addAuth) == -1) {
            return toastr.error('无详情页访问权限', null, assign({}, ToastrUtils.defaultOptions, {
                progressBar: true,
                preventDuplicates: true,
                timeOut: 2000
            }));
        }
        const editable = this.state.roles.indexOf(`${this.state.authPrefix}form_edit`) != -1;
        this.formAction(_id, editable == true ? 1 : null);
    },
    refreshTableRows(){
        const self = this;
        const schema = self.props.schema || {};
        const fields = schema.fields || {};
        const pagingParams = this.state.pagingParams || {};
        const actions = this.state.actions;
        const colsOrder = this.state.colsOrder;
        const fieldConfigs = this.state.config.fields || {};
        const trs = [], dataArray = [];
        const data = _.isArray(pagingParams.data) ? pagingParams.data : [];
        const start = pagingParams.start ? parseInt(pagingParams.start) : 1;

        let emptyMessage = '暂无记录';
        if (colsOrder.length > 0) {
            data.map(function (item, i) {
                const tds = [], row = {};
                //加载自定义按钮
                const configActions = self.state.config.actions || [];
                //添加首列选择框
                tds.push(<td key={0}><input type="checkbox" className='ibird-table-select-item' id={item._id}
                                            style={{opacity: '0'}}/></td>);
                tds.push(<td key={1} style={{textAlign: 'center'}}>{start + i}</td>);
                //添加信息列

                colsOrder.map(function (key, j) {
                    const fieldConfig = fieldConfigs[key] || {};
                    const field = fields[key] || {};
                    const ctrltype = field.ctrltype ? field.ctrltype.toLowerCase() : 'string';
                    let data = (ctrltype != 'number' && !_.isNumber(item[key])) ? (item[key] || '') : item[key];
                    data = data && ['created', 'modified'].indexOf(key) != -1 ? moment(data, 'x').format('YYYY-MM-DD HH:mm:ss') : data;

                    const options = field.refOptions || {};
                    switch (ctrltype) {
                        case 'ref':
                            if (options.display) {
                                data = _.keys(options).length > 0 && _.isObject(data) ? (data[options.display] || '') : data;
                            }
                            break;
                        case 'refs':
                            let displays = [];
                            if (options.display && _.isArray(data)) {
                                data.forEach(function (item) {
                                    if (!item || !item[options.display]) return;
                                    displays.push(item[options.display]);
                                });
                                displays = _.uniq(displays);
                            }
                            data = displays.length > 0 ? displays.join(',') : data;
                            break;
                        case 'boolean-radios':
                            //TODO 服务端查询时，给checkbox和radio的ref类型，也添加populate
                            data = (field.items || {})[data] || data;
                            break;
                        case 'boolean-checkbox':
                            //TODO 服务端查询时，给checkbox和radio的ref类型，也添加populate
                            let checkboxValue = data;
                            data = [];
                            if (!_.isArray(checkboxValue)) checkboxValue = checkboxValue.split(',');
                            checkboxValue.forEach(function (d) {
                                data.push((field.items || {})[d] || d);
                            });
                            data = data.join(',');
                            break;
                    }
                    const rowData = fieldConfig.row && _.isFunction(fieldConfig.row) ? fieldConfig.row(assign({
                        $this: self,
                        data: data,
                        key: key,
                        row: item
                    }, self.assignContext())) : data;

                    tds.push(<td key={i + '-' + j}>{rowData}</td>);
                    row[key] = data;
                });
                //添加操作列
                const views = self.registerCustomActions(configActions, item, actions);
                tds.push(
                    <td key={tds.length}>
                        <div className="btn-group" style={{minWidth: '45px'}}>
                            <button type="button" id={item._id} data-i={item._id} className="btn btn-default btn-xs"
                                    onClick={self._onFormAction} style={{display: self.getDisplayAuth('form_view')}}>
                                <i className="fa fa-eye"></i>
                            </button>
                            <button type="button" id={item._id} data-i={item._id} className="btn btn-primary btn-xs"
                                    onClick={self._onFormAction} data-view="1"
                                    style={{display: self.getDisplayAuth('form_edit')}}>
                                <i className="fa fa-edit"></i>
                            </button>
                            <button type="button" id={item._id} className="btn btn-danger btn-xs"
                                    onClick={self._deleteAction}
                                    style={{display: self.getDisplayAuth('list_ui_colact_delete')}}>
                                <i className="fa fa-minus"></i>
                            </button>
                        </div>
                        {views}
                    </td>
                );
                trs.push(<tr onClick={self._onRowClick} onDoubleClick={self._onRowDoubleClick} key={i}
                             data-id={item._id}>{tds}</tr>);
                dataArray.push(row);
            });
        } else {
            emptyMessage = '暂无可访问列';
        }
        if (trs.length == 0) {
            trs.push(<tr key={uuid.v4()}>
                <td colSpan={colsOrder.length + 3}>{emptyMessage}</td>
            </tr>);
        }
        const customToolbarViews = self.registerCustomActions(this.state.config.toolbar, pagingParams, actions);
        this.setState({
            trs: trs,
            actions: actions,
            customToolbarViews: customToolbarViews
        }, () => {
            $('.ibird-table-select-item').iCheck('uncheck');
            $('.ibird-table-selectedIds').text('');
            this.selectedIds = []
        });
    },
    registerCustomActions(configs, data, actions){
        if (!configs || !_.isArray(configs)) return [];
        const views = [];
        const self = this;
        configs.forEach( (item, j) => {
            if (!item || !_.isFunction(item.render) || !_.isFunction(item.action)) return;
            if (item.authid && self.state.roles.indexOf(item.authid) == -1) return;
            const aid = uuid.v1();
            const view = item.render(assign({
                $this: self,
                data: data,
                action: self._defActions
            }, self.assignContext()));
            views.push(<span key={j} data-aid={aid} className="ibird-table-actions">{view}</span>);
            actions[aid] = {
                action: item.action,
                data: data,
            };
        });
        return views;
    },
    _batchDeleteAction(){
        const schema = this.props.schema;
        if (schema.delete == false) return toastr.warning('抱歉，禁止删除操作', null, ToastrUtils.defaultOptions);
        const selectedIds = this.selectedIds;
        if (selectedIds.length == 0) return toastr.warning('请勾选需要删除的行', null, ToastrUtils.defaultOptions);
        this.comfirmDelete(selectedIds);
    },
    _settingAction(){
        toastr.info('Comming soon...', null, ToastrUtils.defaultOptions);
    },
    _onAddAction(e){
        const schema = this.props.schema;
        if (!schema) return;
        if (schema.add == false) return toastr.warning('抱歉，禁止新增操作', null, ToastrUtils.defaultOptions);
        this.formAction(null, 2);
    },
    _onFormAction(e){
        const id = e.target.getAttribute('data-i') || e.target.parentNode.getAttribute('data-i');
        const view = e.target.getAttribute('data-view') || e.target.parentNode.getAttribute('data-view');
        if (!id) return;
        this.formAction(id, view);
    },
    formAction(id, view){
        const schema = this.props.schema;
        if (!schema) return;
        if (schema.update == false) return toastr.warning('抱歉，禁止修改操作', null, ToastrUtils.defaultOptions);
        this.context.router.push({
            pathname: "/home/" + this.props.module + "/" + this.props.path,
            query: {m: this.props.model, f: uuid.v4(), i: id, view: view},
            state: {
                item: this.props.item
            }
        });
    },
    _deleteAction(e){
        const self = this;
        const schema = this.props.schema;
        if (schema.delete == false) return toastr.warning('抱歉，禁止删除操作', null, ToastrUtils.defaultOptions);
        const $target = $(e.target).is('button') ? $(e.target) : $(e.target).parent('button');
        if (!$target.attr('id')) return toastr.error('操作异常，请重新刷新界面', null, ToastrUtils.defaultOptions);
        this.comfirmDelete([$target.attr('id')]);
    },
    comfirmDelete(selectedIds){
        const schema = this.props.schema;
        if (schema.delete == false) return toastr.warning('抱歉，禁止删除操作', null, ToastrUtils.defaultOptions);
        const self = this;
        toastr.warning('确认删除吗？<br/><br/><button type="button" class="btn btn-primary" id="ibird-table-delete-comfirm">确认</button>', null, assign({}, ToastrUtils.defaultOptions, {
            progressBar: false,
            closeButton: true,
            timeOut: 0,
            extendedTimeOut: 0,
            preventDuplicates: true
        }));
        $('#ibird-table-delete-comfirm').click(e => this.fetchDelete(selectedIds));
    },
    fetchDelete(selectedIds){
        if (!_.isArray(selectedIds) || selectedIds.length == 0)return;
        const self = this;
        const query = qs.stringify({access_token: this.state.access_token});
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode) + '?' + query, {
            method: 'DELETE',
            body: JSON.stringify({_id: {$in: selectedIds}}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);

            const $selectall = $('.ibird-table-select-all');
            if ($selectall.is(':checked')) $selectall.iCheck('uncheck');

            toastr.success('删除成功', null, ToastrUtils.defaultOptions);
            this.fetchModelData();
        });
    },
    _onDownUploadTemplate(){
        toastr.success('下载导入模板...', null, ToastrUtils.defaultOptions);
        this.refs['ibird-table-export-template'].value = '1';
        this.refs['ibird-table-export-form'].submit();
    },
    _onSubmitImport(){
        toastr.info('执行导入中，请稍候', null, ToastrUtils.defaultOptions);
        const self = this;
        const input = this.refs['ibird-table-import-files'];
        const data = new FormData();
        data.append('importFiles', input.files[0]);
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode + '/data/import') + '?' + qs.stringify({access_token: this.state.access_token}), {
            method: 'POST',
            body: data
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            toastr.success('导入成功', null, ToastrUtils.defaultOptions);
            self.fetchModelData();
        });
    },
    getDisplayIds(){
        const display = [];
        $('.ibird-table-select-item').each(function () {
            if (!$(this).attr('id')) return;
            display.push($(this).attr('id'));
        });
        return display;
    },
    getSelectedIds(){
        const selected = [];
        $('.ibird-table-select-item').each(function () {
            if (!$(this).attr('id')) return;
            if ($(this).is(':checked') != true) return;
            selected.push($(this).attr('id'));
        });
        return selected;
    },
    getSelectedRows(){
        return this.getRowsByIds(this.getSelectedIds());
    },
    getDisplayRows(){
        return this.getRowsByIds(this.getDisplayIds());
    },
    getRowsByIds(ids){
        if (!ids) return [];
        ids = _.isArray(ids) ? ids : [ids];
        const rows = [];
        const pagingParams = this.state.pagingParams;
        if (!pagingParams || !_.isArray(pagingParams.data)) return rows;
        if (pagingParams.data.length == 0 || ids.length == 0) return rows;
        //转换key、value形式
        const _idMap = _.groupBy(pagingParams.data, '_id');
        ids.forEach(_id => {
            if (!_id || !_.isArray(_idMap[_id]) || _idMap[_id].length == 0) return;
            const row = _idMap[_id][0];
            rows.push(row);
        });
        return rows;
    },
    _onSubmitExport(){
        toastr.info('执行导出中，请稍候', null, ToastrUtils.defaultOptions);
        if ('1' == this.refs['ibird-table-export-template'].value) return true;
        const display = this.getDisplayIds();
        const selected = this.getSelectedIds();
        let dataRange = 'all';
        $('.downloadModal-dataRange').each(function () {
            if ($(this).is(':checked') == true) dataRange = $(this).val();
        });
        let fileType = 'excel';
        $('.downloadModal-fileType').each(function () {
            if ($(this).is(':checked') == true) fileType = $(this).val();
        });
        let _ids = '';
        switch (dataRange) {
            case 'selected':
                _ids = selected.join(',');
                break;
            case 'show':
                _ids = display.join(',');
                break;
        }
        this.refs['ibird-table-export-all'].value = dataRange == 'all' ? '1' : '0';
        this.refs['ibird-table-export-ids'].value = _ids;
        this.refs['ibird-table-export-type'].value = fileType;

        console.log("this.refs['ibird-table-export-ids'].value", this.refs['ibird-table-export-ids'].value);
        return true;
    },
    getDisplayAuth(authid){
        const display = 'block';
        if (!authid) return display;
        const addAuth = `${this.state.authPrefix}${authid}`;
        if (this.state.roles.indexOf(addAuth) == -1) return 'none';
        return display;
    },
    render(){
        const self = this;
        const pagingParams = this.state.pagingParams;
        const schema = this.props.schema || {};
        const query = schema.query || {};
        const queryShow = !(query.show == false);
        return (
            <div className={`row ibird-table-${this.state.moduleCode}-${this.state.modelCode}`}>
                {this.state.defviews}
                <div className="modal fade" id="uploadModal" tabIndex="-1" role="dialog" aria-labelledby="uploadModal"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span
                                    aria-hidden="true">&times;</span><span className="sr-only">关闭</span></button>
                                <h4 className="modal-title" id="uploadModal">导入操作</h4>
                            </div>
                            <div className="modal-body">
                                <ol>
                                    <li>
                                        <div>下载导入模板</div>
                                        <button type="button" className="btn btn-default btn-sm"
                                                onClick={this._onDownUploadTemplate}>
                                            标准导入模板
                                        </button>
                                    </li>
                                    <li>
                                        <div>上传Excel文件</div>
                                        <input type="file" className="btn btn-default btn-sm"
                                               ref="ibird-table-import-files"/>
                                    </li>
                                </ol>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary" onClick={this._onSubmitImport}>
                                    执行导入
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="downloadModal" tabIndex="-1" role="dialog"
                     aria-labelledby="downloadModal"
                     aria-hidden="true">
                    <form onSubmit={this._onSubmitExport} method="post"
                          ref="ibird-table-export-form"
                          action={RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode + '/data/export') + '?' + qs.stringify({access_token: this.state.access_token})}>
                        <input type="hidden" name="all" ref="ibird-table-export-all"/>
                        <input type="hidden" name="_ids" ref="ibird-table-export-ids"/>
                        <input type="hidden" name="type" ref="ibird-table-export-type"/>
                        <input type="hidden" name="template" ref="ibird-table-export-template"/>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal"><span
                                        aria-hidden="true">&times;</span><span className="sr-only">关闭</span></button>
                                    <h4 className="modal-title" id="downloadModal">导出操作</h4>
                                </div>
                                <div className="modal-body">
                                    <ol>
                                        <li>
                                            <div>导出数据范围</div>
                                            <div>
                                                <label key={1}>
                                                    <input type="radio" className='downloadModal-dataRange'
                                                           id="downloadModal-dataRange-selected"
                                                           name='downloadModal-dataRange' defaultValue='selected'/>
                                                    <span>当前选中</span>
                                                </label>
                                                <label key={2}>
                                                    <input type="radio" className='downloadModal-dataRange'
                                                           id="downloadModal-dataRange-show"
                                                           name='downloadModal-dataRange' defaultValue='show'/>
                                                    <span>当前显示</span>
                                                </label>
                                                <label key={3}>
                                                    <input type="radio" className='downloadModal-dataRange'
                                                           id="downloadModal-dataRange-all"
                                                           name='downloadModal-dataRange' defaultValue='all'/>
                                                    <span>所有数据</span>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div>导出文件类型</div>
                                            <div>
                                                <label key={1}>
                                                    <input type="radio" className="downloadModal-fileType"
                                                           id="downloadModal-fileType-excel"
                                                           name='downloadModal-fileType' defaultValue='excel'/>
                                                    <span>Excel文件</span>
                                                </label>
                                                <label key={2}>
                                                    <input type="radio" className="downloadModal-fileType"
                                                           id="downloadModal-fileType-pdf"
                                                           name='downloadModal-fileType' defaultValue='pdf'/>
                                                    <span>PDF文件</span>
                                                </label>
                                                <label key={3}>
                                                    <input type="radio" className="downloadModal-fileType"
                                                           id="downloadModal-fileType-txt"
                                                           name='downloadModal-fileType' defaultValue='txt'/>
                                                    <span>文本文件</span>
                                                </label>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                    <button type="submit" className="btn btn-primary">确认导出
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header with-border">
                            <h2 className="box-title">
                                {this.props.schema.label}
                                <small className="ibird-table-selectedIds"></small>
                            </h2>
                            <div className="box-tools">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-primary" onClick={self._onAddAction}
                                            style={{display: this.getDisplayAuth('form_add')}}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                    <button type="button" className="btn btn-primary"
                                            onClick={self._batchDeleteAction}
                                            style={{display: this.getDisplayAuth('list_ui_toolbar_delete')}}>
                                        <i className="fa fa-minus"></i>
                                    </button>
                                    <button type="button" className="btn btn-primary"
                                            data-toggle="modal"
                                            data-target="#uploadModal" data-backdrop="false"
                                            style={{display: this.getDisplayAuth('list_ui_toolbar_import')}}>
                                        <i className="fa fa-upload"></i>
                                    </button>
                                    <button type="button" className="btn btn-primary"
                                            data-toggle="modal"
                                            data-target="#downloadModal" data-backdrop="false"
                                            style={{display: this.getDisplayAuth('list_ui_toolbar_export')}}>
                                        <i className="fa fa-download"></i>
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={self._onRefreshAction}
                                            style={{display: this.getDisplayAuth('list_ui_view')}}>
                                        <i className="fa fa-refresh"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row ibird-table-def-toolbar">
                            <div className="col-md-4 col-xs-12 col-sm-12"
                                 style={{display: queryShow == true ? this.getDisplayAuth('list_ui_search') : 'none'}}>
                                <div className="form-group">
                                    <div className="input-group">
                                        <input type="text" name="table_search" className="form-control"
                                               placeholder={`请输入${this.state.queryPlaceholder}关键字`} ref="keyword"
                                               defaultValue={pagingParams.keyword || ''}/>
                                        <div className="input-group-addon"
                                             onClick={self._onKeywordAction}>
                                            <i className="fa fa-search"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 col-xs-12 col-sm-12">
                                {this.state.customToolbarViews}
                            </div>
                        </div>
                        <div className="box-body table-responsive no-padding">
                            <table className="table table-hover ibird-table">
                                <thead>
                                <tr>{this.state.colsTh}</tr>
                                </thead>
                                <tbody>
                                {this.state.trs}
                                </tbody>
                            </table>
                        </div>
                        <div className="box-footer clearfix">
                            <div className="pull-left" style={{}}>
                                <span>第</span>
                                <input type="text" className="form-control"
                                       style={{
                                           width: '25px',
                                           height: '20px',
                                           padding: '0px',
                                           display: 'inline-block',
                                           textAlign: 'center'
                                       }}
                                       value={this.state.pagingParams.page || 1}
                                       onChange={self._onPageChange}/>
                                <span>/{pagingParams.totalpages}页,每页</span>
                                <input type="text" className="form-control"
                                       style={{
                                           width: '25px',
                                           height: '20px',
                                           padding: '0px',
                                           display: 'inline-block',
                                           textAlign: 'center'
                                       }}
                                       value={this.state.pagingParams.size || 0}
                                       onChange={self._onSizeChange}/>
                                <span>条</span>
                                &nbsp;&nbsp;&nbsp;
                                <span style={{color: '#B1A9A9'}}>
                                    <span>显示&nbsp;{pagingParams.start}&nbsp;
                                        -&nbsp;{pagingParams.end},共&nbsp;{pagingParams.totalelements}&nbsp;条记录</span>
                                </span>
                            </div>
                            <ul className="pagination pagination-sm no-margin pull-right">
                                <li>
                                    <a style={{cursor: 'pointer'}} onClick={self._onPreviousAction}>
                                        <i className="fa fa-caret-left" aria-hidden="true"></i>
                                    </a>
                                </li>
                                <li>
                                    <a style={{cursor: 'pointer'}} onClick={self._onNextAction}>
                                        <i className="fa fa-caret-right" aria-hidden="true"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminTable;