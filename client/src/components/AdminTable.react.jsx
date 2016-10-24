/**
 * 表格组件：
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
const Link = require('react-router').Link;
const RouteUtils = require('../utils/RouteUtils');
const ToastrUtils = require('../utils/ToastrUtils');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('node-uuid');
const config = require('ibird.config');

const AdminTable = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {
            pagingParams: {},
            colsTh: [],
            colsOrder: [],

            moduleCode: this.props.module,
            path: this.props.path,
            modelCode: this.props.model,
            actions: {},
            trs: [],
            delIdArray: [],
            config: config.models[this.props.module + '-' + this.props.model] || {},
            customToolbarViews: []
        };
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        state.token = token;
        state.access_token = token.access_token;
        return state;
    },
    componentWillReceiveProps: function (nextProps) {
        const self = this;
        this.setState({
            moduleCode: nextProps.module,
            modelCode: nextProps.model,
            trs: [],
            customToolbarViews: [],
            actions: {},
            config: config.models[nextProps.module + '-' + nextProps.model] || {}
        }, function () {
            self.createTableHeader();
            self.fetchModelData();
        });
    },
    componentDidUpdate: function (prevProps, prevState) {
        if ($('.ibird-table-select-all').parent().is('th') == true) {
            $('.ibird-table-select-all').iCheck({
                checkboxClass: 'icheckbox_square-blue'
            }).on('ifToggled', (function (e) {
                $('.ibird-table-select-item').iCheck(($('.ibird-table-select-all').is(':checked') == true) ? 'check' : 'uncheck');
            }));
        }
        if ($('.ibird-table-select-item').parent().is('td') == true) {
            $('.ibird-table-select-item').iCheck({
                checkboxClass: 'icheckbox_square-blue'
            });
        }
    },
    componentWillMount(){
        this.createTableHeader();
        this.fetchModelData();
    },
    componentDidMount(){
    },
    fetchModelData(){
        const self = this;
        const pagingParams = this.state.pagingParams;
        const query = qs.stringify({
            page: pagingParams.page > 1 ? pagingParams.page : 1,
            size: pagingParams.size,
            sort: pagingParams.sort,
            keyword: pagingParams.keyword
        });
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode + '?' + query), {
            headers: {
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({pagingParams: json});
            self.refreshTableRows();
        });
    },
    createTableHeader(){
        const self = this;
        const schema = this.props.schema;
        const pagingParams = this.state.pagingParams;
        const fieldConfigs = this.state.config.fields || {};
        const fields = schema.fields || {};
        const colsTh = [], colsOrder = [], columns = [];
        colsTh.push(<th key={uuid.v4()}><input type="checkbox" className='ibird-table-select-all'
                                               style={{opacity: '0'}}/></th>);
        // console.log(fields);
        Object.keys(fields).map(function (key) {
            const display = fields[key].display || {};
            if (!fields[key] || !fields[key].label || ['ref', 'refs', 'files', 'textarea', 'password'].indexOf(fields[key].ctrltype) != -1 || display.table == false) return;
            const fieldConfig = fieldConfigs[key] || {};
            const label = fieldConfig.label || fields[key].label;

            let sortIconDOM = null;
            if (key == pagingParams.sort) {
                sortIconDOM = <i data-code={key} className="fa fa-sort-asc" aria-hidden="true"></i>;
            } else if ('-' + key == pagingParams.sort) {
                sortIconDOM = <i data-code={key} className="fa fa-sort-desc" aria-hidden="true"></i>;
            }

            colsTh.push(
                <th style={{cursor: 'pointer', minWidth: '80px', width: '100%'}} onClick={self._onSortAction}
                    data-code={key}
                    key={key}>{fieldConfig.column && _.isFunction(fieldConfig.column) ? fieldConfig.column({
                    $this: self,
                    key: key,
                    data: label
                }) : label} {sortIconDOM}</th>
            );
            colsOrder.push(key);
            columns.push({data: key});
        });
        colsTh.push(<th key={uuid.v4()} style={{minWidth: '80px', width: '100%'}}>操作</th>);
        this.setState({
            colsTh: colsTh,
            colsOrder: colsOrder,
            columns: columns,
            trs: [<tr key={uuid.v4()}>
                <td colSpan={colsOrder.length + 2}>加载中，请稍候...</td>
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
        this.setState({pagingParams: pagingParams}, () =>this.fetchModelData());
    },
    _onNextAction(e){
        const pagingParams = this.state.pagingParams;
        if (pagingParams.page >= pagingParams.totalpages) return toastr.info((pagingParams.totalpages == 1) ? '只有一页' : '已是最后一页', null, ToastrUtils.defaultOptions);
        pagingParams.page++;
        this.setState({pagingParams: pagingParams}, () => this.fetchModelData());
    },
    _onKeywordAction(){
        const pagingParams = this.state.pagingParams;
        pagingParams.keyword = this.refs.keyword.value;
        this.setState({pagingParams: pagingParams}, () => this.fetchModelData());
    },
    _customActionsAction(e){
        const actions = this.state.actions;
        const aid = e.target.getAttribute('data-aid') || e.target.parentNode.getAttribute('data-aid');
        if (!aid || !actions[aid] || !_.isFunction(actions[aid].action)) return;
        actions[aid].action({$this: this, data: actions[aid].data, e: e});
    },
    refreshTableRows(){
        const self = this;
        const schema = self.props.schema || {};
        const fields = schema.fields || {};
        const pagingParams = this.state.pagingParams;
        const actions = this.state.actions;
        const colsOrder = this.state.colsOrder;
        const fieldConfigs = this.state.config.fields || {};
        const trs = [], dataArray = [];
        if (!pagingParams.data) return;
        pagingParams.data.map(function (item, i) {
            const tds = [], row = {};
            //加载自定义按钮
            const configActions = self.state.config.actions || [];
            //添加首列选择框
            tds.push(<td key={0}><input type="checkbox" className='ibird-table-select-item' id={item._id}
                                        style={{opacity: '0'}}/></td>);
            //添加信息列
            colsOrder.map(function (key, j) {
                const fieldConfig = fieldConfigs[key] || {};
                const field = fields[key] || {};
                let data = item[key] || '';
                switch (field.ctrltype) {
                    case 'boolean-radios':
                        data = (field.items || {})[data];
                        break;
                    case 'boolean-checkbox':
                        let checkboxValue = data;
                        data = [];
                        if (!_.isArray(checkboxValue)) checkboxValue = checkboxValue.split(',');
                        checkboxValue.forEach(function (d) {
                            data.push((field.items || {})[d]);
                        });
                        data = data.join(',');
                        break;
                }
                tds.push(<td
                    key={i + '-' + j}>{fieldConfig.row && _.isFunction(fieldConfig.row) ? fieldConfig.row({
                    $this: self,
                    data: data,
                    key: key,
                    row: item
                }) : data}</td>);
                row[key] = data;
            });
            //添加操作列
            const views = self.registerCustomActions(configActions, item, actions);
            tds.push(
                <td key={tds.length}>
                    <div className="btn-group" style={{minWidth: '45px'}}>
                        <Link
                            to={{
                                pathname: "/home/" + self.props.module + "/" + self.props.path,
                                query: {m: self.props.model, f: uuid.v4(), i: item._id},
                                state: {
                                    item: self.props.item
                                }
                            }}
                            className="btn btn-primary btn-xs">
                            <i className="fa fa-edit"></i>
                        </Link>
                        <button id={item._id} className="btn btn-danger btn-xs" onClick={self._deleteAction}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                    {views}
                </td>
            );
            trs.push(<tr key={uuid.v4()}>{tds}</tr>);
            dataArray.push(row);
        });
        if (trs.length == 0) trs.push(<tr key={uuid.v4()}>
            <td colSpan={colsOrder.length + 2}>暂无记录</td>
        </tr>);

        const customToolbarViews = self.registerCustomActions(this.state.config.toolbar, pagingParams, actions);
        this.setState({trs: trs, actions: actions, customToolbarViews: customToolbarViews});
    },
    registerCustomActions(configs, data, actions){
        if (!configs || !_.isArray(configs)) return [];
        const views = [];
        const self = this;
        configs.forEach(function (item, j) {
            if (!item || !_.isFunction(item.render) || !_.isFunction(item.action)) return;
            const aid = uuid.v1();
            const view = item.render({
                $this: self,
                data: data,
                action: self._customActionsAction
            });
            views.push(<span key={j} data-aid={aid} className="ibird-table-actions">{view}</span>);
            actions[aid] = {
                action: item.action,
                data: data,
            };
        });
        return views;
    },
    _batchDeleteAction(){
        const delIdArray = [];
        $('.ibird-table-select-item').each(function () {
            if ($(this).is(':checked') != true || !$(this).attr('id')) return;
            delIdArray.push($(this).attr('id'));
        });
        if (delIdArray.length == 0) return toastr.warning('请勾选需要删除的行', null, ToastrUtils.defaultOptions);
        this.setState({delIdArray: delIdArray});
        this.comfirmDelete();
    },
    _deleteAction(e){
        const $target = $(e.target).is('button') ? $(e.target) : $(e.target).parent('button');
        if (!$target.attr('id')) return toastr.error('操作异常，请重新刷新界面', null, ToastrUtils.defaultOptions);
        this.setState({delIdArray: [$target.attr('id')]});
        this.comfirmDelete();
    },
    comfirmDelete(){
        const self = this;
        toastr.warning('确认删除吗？<br/><br/><button type="button" class="btn btn-primary" id="ibird-table-delete-comfirm">确认</button>', null, {
            progressBar: false,
            closeButton: true,
            timeOut: 0,
            extendedTimeOut: 0,
            preventDuplicates: true
        });
        $('#ibird-table-delete-comfirm').click(self.fetchDelete);
    },
    fetchDelete(){
        const idArray = this.state.delIdArray;
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode), {
            method: 'DELETE',
            body: JSON.stringify({_id: {$in: idArray}}),
            headers: {
                "Content-Type": "application/json",
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            toastr.info('删除成功，请重新刷新界面', null, ToastrUtils.defaultOptions);
        });
    },
    render(){
        const self = this;
        const pagingParams = this.state.pagingParams;
        const query = this.props.schema.query || {};
        const toolbarShow = query.show == undefined ? true : query.show;
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box" style={{minWidth: '270px'}}>
                        <div className="box-header">
                            <div className="row">
                                <div className="col-xs-12 col-md-12" style={{marginBottom: '5px'}}>
                                    <h3 className="box-title">{this.props.schema.label}</h3>
                                    <div className="box-tools pull-right ibird-table-tools">
                                        <div className="input-group input-group-sm"
                                             style={{
                                                 width: '250px',
                                                 background: 'transparent',
                                                 textAlign: 'right',
                                                 marginLeft: '5px',
                                                 display: toolbarShow == true ? 'inline-block' : 'none'
                                             }}>
                                            <input type="text" name="table_search" className="form-control"
                                                   placeholder="请输入关键字" ref="keyword"
                                                   defaultValue={pagingParams.keyword || ''} style={{width: '150px'}}/>
                                            <div className="input-group-btn">
                                                <button className="btn btn-primary" onClick={self._onKeywordAction}>
                                                    <i className="fa fa-search"></i>
                                                </button>
                                                <Link
                                                    to={{
                                                        pathname: "/home/" + this.props.module + "/" + this.props.path,
                                                        query: {f: uuid.v4()},
                                                        state: {
                                                            item: self.props.item
                                                        }
                                                    }}
                                                    className="btn btn-primary">
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                                <button className="btn btn-primary" onClick={self._batchDeleteAction}>
                                                    <i className="fa fa-minus"></i>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-12">
                                    {this.state.customToolbarViews}
                                </div>
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