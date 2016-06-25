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
            trs: []
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
    componentDidMount(){
        // console.log('AdminTable...');
        const self = this;
        this.createTableHeader();
        this.fetchModelData();
    },
    fetchModelData(){
        // console.log('fetchModelData...', this.state.moduleCode, this.state.modelCode);
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
        Object.keys(obj).map(function (key) {
            if (!obj[key] || !obj[key].label) return;
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
        this.setState({colsTh: colsTh, colsOrder: colsOrder, columns: columns});
    },
    _onSortAction(e){
        const code = e.target.getAttribute('data-code');
        console.log(code);
        if (!code) return;
        const dinfo = this.state.dinfo;
        dinfo.sort = (dinfo.sort != code) ? code : '-' + code;
        this.setState({dinfo: dinfo}, function () {
            setTimeout(function () {
                this.createTableHeader();
                this.fetchModelData();
            }.bind(this));
        }.bind(this));
    },
    _onSizeChange(e){
        if (!e.target.value) return;
        console.log(e.target.value);
        const dinfo = this.state.dinfo;
        dinfo.size = e.target.value;
        this.setState({dinfo: dinfo}, function () {
            setTimeout(function () {
                this.fetchModelData();
            }.bind(this));
        }.bind(this));
    },
    _onPageChange(e){
        if (!e.target.value) return;
        console.log(e.target.value);
        const dinfo = this.state.dinfo;
        dinfo.page = e.target.value;
        this.setState({dinfo: dinfo}, function () {
            setTimeout(function () {
                this.fetchModelData();
            }.bind(this));
        }.bind(this));
    },
    _onPreviousAction(e){
        console.log('_onPreviousAction...');
        const dinfo = this.state.dinfo;
        if (dinfo.page <= 1) return toastr.info((dinfo.totalpages == 1) ? '只有一页' : '已是第一页', null, ToastrUtils.defaultOptions);
        dinfo.page--;
        this.setState({dinfo: dinfo}, function () {
            setTimeout(function () {
                this.fetchModelData();
            }.bind(this));
        }.bind(this));
    },
    _onNextAction(e){
        console.log('_onNextAction...');
        const dinfo = this.state.dinfo;
        if (dinfo.page >= dinfo.totalpages) return toastr.info((dinfo.totalpages == 1) ? '只有一页' : '已是最后一页', null, ToastrUtils.defaultOptions);
        dinfo.page++;
        this.setState({dinfo: dinfo}, function () {
            setTimeout(function () {
                this.fetchModelData();
            }.bind(this));
        }.bind(this));
    },
    _onKeywordAction(){
        const dinfo = this.state.dinfo;
        dinfo.keyword = this.refs.keyword.value;
        this.setState({dinfo: dinfo}, function () {
            setTimeout(function () {
                this.fetchModelData();
            }.bind(this));
        }.bind(this));
    },
    refreshTableRows(){
        const self = this;
        const dinfo = this.state.dinfo;
        const colsOrder = this.state.colsOrder;
        const trs = [], dataArray = [];
        if (!dinfo.data) return;
        dinfo.data.map(function (item) {
            const tds = [], row = {};
            colsOrder.map(function (key) {
                tds.push(<td key={uuid.v4()}>{item[key]}</td>);
                row[key] = item[key] || '';
            });
            tds.push(
                <td key={uuid.v4()}>
                    <Link
                        to={{pathname:"/index/"+self.props.module+"/"+self.props.path,query:{m:self.props.model,f:uuid.v4(),i:item._id}}}
                        className="btn btn-default btn-xs">
                        <i className="fa fa-minus"></i>
                    </Link>
                </td>
            );
            trs.push(<tr key={uuid.v4()}>{tds}</tr>);
            dataArray.push(row);
        });
        this.setState({trs: trs});
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