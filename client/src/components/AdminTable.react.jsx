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
const RouteUtils = require('../utils/RouteUtils');
const ToastrUtils = require('../utils/ToastrUtils');
const _ = require('underscore');
const uuid = require('node-uuid');


const AdminTable = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const state = {
            dinfo: {},
            moduleCode: this.props.module,
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
            self.getModelData(function () {
                self.refreshTableRows()
            });
        });
    },
    componentDidMount(){
        // console.log('AdminTable...');
        const self = this;
        this.createTableHeader();
        this.getModelData(function () {
            self.refreshTableRows();
        });
    },
    getModelData(callback){
        // console.log('getModelData...', this.state.moduleCode, this.state.modelCode);
        const self = this;
        fetch(RouteUtils.CUSTOM('/' + this.state.moduleCode + '/' + this.state.modelCode), {
            headers: {
                "access_token": this.state.access_token
            }
        }).then(function (res) {
            return res.json();
        }).then(function (json) {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({dinfo: json});
            if (_.isFunction(callback)) callback();
        });
    },
    createTableHeader(){
        const schema = this.props.schema;
        const obj = schema.obj;
        const colsTh = [], colsOrder = [], columns = [];
        Object.keys(obj).map(function (key) {
            if (!obj[key] || !obj[key].label) return;
            colsTh.push(<th key={key}>{obj[key].label}</th>);
            colsOrder.push(key);
            columns.push({data: key});
        });
        this.setState({colsTh: colsTh, colsOrder: colsOrder, columns: columns});
    },
    refreshTableRows(){
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
            trs.push(<tr key={uuid.v4()}>{tds}</tr>);
            dataArray.push(row);
        });
        this.setState({trs: trs});
    },
    render(){
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header">
                            <h3 className="box-title">{this.props.schema.label}</h3>
                            <div className="box-tools">
                                <div className="input-group input-group-sm" style={{width: '150px'}}>
                                    <input type="text" name="table_search" className="form-control pull-right"
                                           placeholder="请输入关键字"/>

                                    <div className="input-group-btn">
                                        <button type="submit" className="btn btn-default"><i
                                            className="fa fa-search"></i>
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
                                <span className="pull-left">每页</span>
                                <input type="text" className="form-control pull-left"
                                       style={{width:'20px',height:'20px',padding:'0px'}}/>
                                <span className="pull-left">条，当前第</span>
                                <input type="text" className="form-control pull-left"
                                       style={{width:'40px',height:'20px',padding:'0px'}}/>
                                <span className="pull-left">页</span>
                            </div>
                            <ul className="pagination pagination-sm no-margin pull-right">
                                <li>
                                    <a style={{cursor:'pointer'}}>
                                        <i className="fa fa-caret-left" aria-hidden="true"></i>
                                    </a>
                                </li>
                                <li>
                                    <a style={{cursor:'pointer'}}>
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