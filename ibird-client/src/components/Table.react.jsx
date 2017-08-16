/**
 * 表格组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const assign = require('object-assign');
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');

const AdminTable = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const token = JSON.parse(localStorage.getItem('access_token') || '{}');
        return {
            pagingParams: {},
            colsTh: [],
            colsOrder: [],
            actions: {},
            trs: [],
            delIdArray: [],
            id: uuid.v1(),
            token: token,
            access_token: token.access_token
        };
    },
    componentDidUpdate: function (prevProps, prevState) {
        //P.S：因为Table的Header是动态生成的，所以才需要在这里初始化选择框列，而且其他和动态部分相关的注册也需要在这里做
        $(":input").iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
        this.tableSelectItem();
    },
    tableSelectItem(){
        $(`.ibird-table-select-all-${this.state.id}`).on('ifToggled', (e => {
            $(`.ibird-table-select-item-${this.state.id}`).iCheck(($(`.ibird-table-select-all-${this.state.id}`).is(':checked') == true) ? 'check' : 'uncheck');
        }));
    },
    componentWillMount(){
        this.tableGeneration();
    },
    componentDidMount(){
    },
    getValue(){
        const pagingParams = this.state.pagingParams || {data: []};
        return pagingParams.data;
    },
    setValue(data){
        if (!data) return;
        let pagingParams = this.state.pagingParams;
        if (_.isArray(data)) {
            pagingParams.data = data;
        } else {
            pagingParams = data;
        }
        this.setState({pagingParams: pagingParams}, ()=> this.refreshTableRows());
    },
    addValue(value){
        if (!value) return;
        const pagingParams = this.state.pagingParams || {data: []};
        const data = _.isArray(pagingParams.data) ? pagingParams.data : [];
        data.push(value);
        pagingParams.data = data;
        this.setState({pagingParams: pagingParams}, ()=> this.refreshTableRows());
    },
    updateValue(value){
        if (!value || !value._id) return;
        const pagingParams = this.state.pagingParams || {data: []};
        const data = _.isArray(pagingParams.data) ? pagingParams.data : [];
        data.forEach((item, i) => {
            if (!item || !item._id) return;
            if (item._id != value._id) return;
            data[i] = value;
        });

        pagingParams.data = data;
        this.setState({pagingParams: pagingParams}, ()=> this.refreshTableRows());
    },
    saveValue(value){
        if (!value) return;
        if (value._id) {
            this.updateValue(value);
        } else {
            this.addValue(value);
        }
    },
    delValue(object = {}){
        const value = object.value || {};
        const _id = object._id;
        let index = object.index;
        if (!value && !index) return;
        const pagingParams = this.state.pagingParams || {data: []};
        const data = _.isArray(pagingParams.data) ? pagingParams.data : [];
        if (index) {
            index = parseInt(index);
        } else {
            data.forEach((item, i) => {
                if (!item || !item._id) return;
                if (item._id != _id && item._id != value._id) return;
                index = i;
            });
        }
        if (index < 0 || index >= data.length) return;
        data.splice(index, 1);
        pagingParams.data = data;
        this.setState({pagingParams: data}, ()=> this.refreshTableRows());
    },
    tableGeneration(){
        this.createTableHeader();
        const dataUrl = this.props.dataUrl;
        if (dataUrl) {
            this.fetchModelData();
        } else {
            this.setValue({data: []});
        }
    },
    fetchModelData(){
        const self = this;
        const pagingParams = this.state.pagingParams;
        const query = qs.stringify({
            page: pagingParams.page > 1 ? pagingParams.page : 1,
            size: pagingParams.size,
            sort: pagingParams.sort,
            keyword: pagingParams.keyword,
            access_token: this.state.access_token
        });
        fetch(`${this.props.dataUrl}?${query}`).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({pagingParams: json}, () => this.refreshTableRows());
        });
    },
    createTableHeader(){
        const self = this;
        const schema = this.props.schema;
        const pagingParams = this.state.pagingParams;

        const fields = schema.fields || {};
        const colsTh = [], colsOrder = [], columns = [];
        colsTh.push(<th key={uuid.v4()} style={{minWidth: '50px', width: '50px'}}>序号</th>);
        Object.keys(fields).map(function (key) {
            const display = fields[key].display || {};
            if (!fields[key] || !fields[key].label || ['files', 'textarea', 'editor', 'password'].indexOf(fields[key].ctrltype) != -1 || display.table == false) return;
            const label = fields[key].label;

            let icon = null;
            if (key == pagingParams.sort) {
                icon = <i data-code={key} className="fa fa-sort-asc" aria-hidden="true"></i>;
            } else if ('-' + key == pagingParams.sort) {
                icon = <i data-code={key} className="fa fa-sort-desc" aria-hidden="true"></i>;
            }

            colsTh.push(
                <th style={{cursor: 'pointer', minWidth: '80px', width: '100%'}} onClick={self._onSortAction}
                    data-code={key}
                    key={key}>{label} {icon}</th>
            );
            colsOrder.push(key);
            columns.push({data: key});
        });
        colsTh.push(<th key={uuid.v4()} style={{
            minWidth: '80px',
            width: '100%',
            display: this.props.onDelete == false ? 'none' : 'block'
        }}>操作</th>);
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
        if (!code || !this.props.dataUrl) return;
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
        if (!this.props.dataUrl) return;
        const pagingParams = this.state.pagingParams;
        pagingParams.keyword = this.refs.keyword.value;
        this.setState({pagingParams: pagingParams}, () => this.fetchModelData());
    },
    _onRowClick(e){
        const view = this.props.view;
        if (!(view == 1 || view == 2)) return;
        const _id = e.target.getAttribute('data-id') || e.target.parentNode.getAttribute('data-id');
        const index = e.target.getAttribute('data-index') || e.target.parentNode.getAttribute('data-index');
        const object = e.target.getAttribute('data-object') || e.target.parentNode.getAttribute('data-object');
        const rowSelection = this.props.rowSelection;
        if (!index || !object || !_.isFunction(rowSelection)) return;
        rowSelection({_id: _id, index: index, data: JSON.parse(object)});
    },
    refreshTableRows(){
        const self = this;
        const view = this.props.view;
        const schema = self.props.schema || {};
        const fields = schema.fields || {};
        const pagingParams = this.state.pagingParams || {data: []};
        const colsOrder = this.state.colsOrder;
        const trs = [], dataArray = [];
        const data = _.isArray(pagingParams.data) ? pagingParams.data : [];
        data.map(function (item, i) {
            const tds = [], row = {};
            //加载自定义按钮
            tds.push(<td key={1} style={{textAlign: 'center'}}>{i + 1}</td>);
            //添加信息列
            colsOrder.map(function (key, j) {
                const field = fields[key] || {};
                let data = item[key] || '';
                const options = field.refOptions || {};
                switch (field.ctrltype) {
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
                tds.push(<td
                    key={i + '-' + j}>{data}</td>);
                row[key] = data;
            });
            //添加操作列
            tds.push(
                <td key={tds.length} style={{display: self.props.onDelete == false ? 'none' : ((view == 1 || view == 2) ? 'block' : 'none')}}>
                    <div className="btn-group" style={{minWidth: '45px'}} data-id={item._id} data-index={i}
                         data-object={JSON.stringify(item)}>
                        <button type="button" data-id={item._id} data-index={i} data-object={JSON.stringify(item)}
                                className="btn btn-danger btn-xs"
                                onClick={self._deleteAction}>
                            <i className="fa fa-minus" data-id={item._id} data-index={i}
                               data-object={JSON.stringify(item)}></i>
                        </button>
                    </div>
                </td>
            );
            trs.push(<tr onClick={self._onRowClick} key={i} data-id={item._id} data-index={i}
                         data-object={JSON.stringify(item)}>{tds}</tr>);
            dataArray.push(row);
        });
        if (trs.length == 0) trs.push(<tr key={uuid.v4()}>
            <td colSpan={colsOrder.length + 2}>暂无记录</td>
        </tr>);
        this.setState({trs: trs});
    },
    _deleteAction(e){
        console.log('_deleteAction...');
        const id = e.target.getAttribute('data-id') || e.target.parentNode.getAttribute('data-id');
        const index = e.target.getAttribute('data-index') || e.target.parentNode.getAttribute('data-index');
        const object = e.target.getAttribute('data-object') || e.target.parentNode.getAttribute('data-object');
        const onDelete = this.props.onDelete;
        const pagingParams = this.state.pagingParams;
        if (!id || onDelete == false) return;
        if (_.isFunction(onDelete)) {
            onDelete({id: id, index: index, object: JSON.parse(object)});
        } else if (pagingParams.data.length > 0) {
            pagingParams.data.splice(index, 1);
            this.setValue(pagingParams);
        }
    },
    render(){
        const self = this;
        const pagingParams = this.state.pagingParams;
        const schema = this.props.schema;
        return (
            <div className="box box-solid">
                <div className="box-header with-border"
                     style={{display: !this.props.dataUrl && !schema.label ? 'none' : 'block'}}>
                    <h3 className="box-title" style={{display: schema.label ? 'block' : 'none'}}>{schema.label}</h3>
                    <div className="box-tools pull-right" style={{display: this.props.dataUrl ? 'block' : 'none'}}>
                        <div className="has-feedback">
                            <input type="text" className="form-control input-sm" placeholder="请输入关键字" ref="keyword"
                                   defaultValue={pagingParams.keyword || ''}/>
                            <span className="glyphicon glyphicon-search form-control-feedback"
                                  onClick={self._onKeywordAction}></span>
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
                <div className="box-footer clearfix" style={{display: this.props.dataUrl ? 'block' : 'none'}}>
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
                               value={pagingParams.page || 1}
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
                               value={pagingParams.size || 0}
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

        );
    }
});

module.exports = AdminTable;