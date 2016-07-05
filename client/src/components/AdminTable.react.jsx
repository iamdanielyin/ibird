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
const _ = require('underscore');
const qs = require('qs');
const uuid = require('node-uuid');


const AdminTable = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {
            dinfo: {},
            moduleCode: this.props.module,
            path: this.props.path,
            modelCode: this.props.model,
            colsTh: [],
            colsOrder: [],
            trs: [],
            delIdArray: []
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
            trs: []
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
        const dinfo = this.state.dinfo;
        const query = qs.stringify({
            page: dinfo.page > 1 ? dinfo.page : 1,
            size: dinfo.size,
            sort: dinfo.sort,
            keyword: dinfo.keyword
        });
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode + '?' + query), {
            headers: {
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({dinfo: json});
            self.refreshTableRows();
        });
    },
    createTableHeader(){
        const self = this;
        const schema = this.props.schema;
        const dinfo = this.state.dinfo;
        const obj = schema.obj;
        const colsTh = [], colsOrder = [], columns = [];
        colsTh.push(<th key={uuid.v4()}><input type="checkbox" className='ibird-table-select-all'
                                               style={{opacity:'0'}}/></th>);
        Object.keys(obj).map(function (key) {
            if (!obj[key] || !obj[key].label || ['ref', 'refs', 'files', 'textarea', 'boolean-checkbox'].indexOf(obj[key].inputType) != -1) return;
            let sortIconDOM = null;
            if (key == dinfo.sort)
                sortIconDOM = <i data-code={key} className="fa fa-sort-asc" aria-hidden="true"></i>;
            else if ('-' + key == dinfo.sort)
                sortIconDOM = <i data-code={key} className="fa fa-sort-desc" aria-hidden="true"></i>;
            colsTh.push(
                <th style={{cursor:'pointer'}} onClick={self._onSortAction} data-code={key}
                    key={key}>{obj[key].label} {sortIconDOM}</th>
            );
            colsOrder.push(key);
            columns.push({data: key});
        });
        colsTh.push(<th key={uuid.v4()}>操作</th>);
        this.setState({
            colsTh: colsTh,
            colsOrder: colsOrder,
            columns: columns,
            trs: [<tr key={uuid.v4()}>
                <td colSpan={colsOrder.length+2}>加载中，请稍候...</td>
            </tr>]
        });

    },
    _onSortAction(e){
        const code = e.target.getAttribute('data-code');
        if (!code) return;
        const dinfo = this.state.dinfo;
        dinfo.sort = (dinfo.sort != code) ? code : '-' + code;

        this.setState({dinfo: dinfo}, () => {
            this.createTableHeader();
            this.fetchModelData();
        });
    },
    _onSizeChange(e){
        if (!e.target.value) return;
        const dinfo = this.state.dinfo;
        dinfo.size = e.target.value;
        this.setState({dinfo: dinfo}, () => setTimeout(() => this.fetchModelData()));
    },
    _onPageChange(e){
        if (!e.target.value) return;
        const dinfo = this.state.dinfo;
        dinfo.page = e.target.value;
        this.setState({dinfo: dinfo}, () => setTimeout(() => this.fetchModelData()));
    },
    _onPreviousAction(e){
        const dinfo = this.state.dinfo;
        if (dinfo.page <= 1) return toastr.info((dinfo.totalpages == 1) ? '只有一页' : '已是第一页', null, ToastrUtils.defaultOptions);
        dinfo.page--;
        this.setState({dinfo: dinfo}, () =>this.fetchModelData());
    },
    _onNextAction(e){
        const dinfo = this.state.dinfo;
        if (dinfo.page >= dinfo.totalpages) return toastr.info((dinfo.totalpages == 1) ? '只有一页' : '已是最后一页', null, ToastrUtils.defaultOptions);
        dinfo.page++;
        this.setState({dinfo: dinfo}, () => this.fetchModelData());
    },
    _onKeywordAction(){
        const dinfo = this.state.dinfo;
        dinfo.keyword = this.refs.keyword.value;
        this.setState({dinfo: dinfo}, () => this.fetchModelData());
    },
    refreshTableRows(){
        const self = this;
        const dinfo = this.state.dinfo;
        const colsOrder = this.state.colsOrder;
        const trs = [], dataArray = [];
        if (!dinfo.data) return;
        dinfo.data.map(function (item) {
            const tds = [], row = {};
            tds.push(<td key={uuid.v4()}><input type="checkbox" className='ibird-table-select-item' id={item._id}
                                                style={{opacity:'0'}}/></td>);
            colsOrder.map(function (key) {
                tds.push(<td key={uuid.v4()}>{item[key]}</td>);
                row[key] = item[key] || '';
            });
            tds.push(
                <td key={uuid.v4()}>
                    <div className="btn-group" style={{minWidth: '45px'}}>
                        <Link
                            to={{pathname:"/index/"+self.props.module+"/"+self.props.path,query:{m:self.props.model,f:uuid.v4(),i:item._id}}}
                            className="btn btn-primary btn-xs">
                            <i className="fa fa-edit"></i>
                        </Link>
                        <button id={item._id} className="btn btn-danger btn-xs" onClick={self._deleteAction}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                </td>
            );
            trs.push(<tr key={uuid.v4()}>{tds}</tr>);
            dataArray.push(row);
        });
        if (trs.length == 0) trs.push(<tr key={uuid.v4()}>
            <td colSpan={colsOrder.length+2}>暂无记录</td>
        </tr>);
        this.setState({trs: trs});
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
        const dinfo = this.state.dinfo;
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header">
                            <h3 className="box-title">{this.props.schema.label}</h3>
                            <div className="box-tools pull-right">
                                <div className="input-group input-group-sm" style={{width: '200px'}}>
                                    <input type="text" name="table_search" className="form-control"
                                           placeholder="请输入关键字" ref="keyword"
                                           defaultValue={dinfo.keyword || ''}/>
                                    <div className="input-group-btn">
                                        <button className="btn btn-default" onClick={self._onKeywordAction}>
                                            <i className="fa fa-search"></i>
                                        </button>
                                        <Link
                                            to={{pathname:"/index/"+this.props.module+"/"+this.props.path,query:{m:this.props.model,f:uuid.v4()}}}
                                            className="btn btn-default">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        <button className="btn btn-danger" onClick={self._batchDeleteAction}>
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box-body table-responsive no-padding">
                            <table className="table table-hover">
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
                                       style={{width:'25px',height:'20px',padding:'0px',display:'inline-block',textAlign:'center'}}
                                       value={this.state.dinfo.page || 1}
                                       onChange={self._onPageChange}/>
                                <span>/{dinfo.totalpages}页,每页</span>
                                <input type="text" className="form-control"
                                       style={{width:'25px',height:'20px',padding:'0px',display:'inline-block',textAlign:'center'}}
                                       value={this.state.dinfo.size || 0}
                                       onChange={self._onSizeChange}/>
                                <span>条</span>
                                &nbsp;&nbsp;&nbsp;
                                <span style={{color:'#B1A9A9'}}>
                                    <span>显示&nbsp;{dinfo.start}&nbsp;
                                        -&nbsp;{dinfo.end},共&nbsp;{dinfo.totalelements}&nbsp;条记录</span>
                                </span>
                            </div>
                            <ul className="pagination pagination-sm no-margin pull-right">
                                <li>
                                    <a style={{cursor:'pointer'}} onClick={self._onPreviousAction}>
                                        <i className="fa fa-caret-left" aria-hidden="true"></i>
                                    </a>
                                </li>
                                <li>
                                    <a style={{cursor:'pointer'}} onClick={self._onNextAction}>
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