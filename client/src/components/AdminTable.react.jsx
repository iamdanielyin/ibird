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
const Chinese = require('../publics/plugins/datatables/i18n/Chinese.json');
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
            colsOrder: []
        };
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        state.token = token;
        state.access_token = token.access_token;
        return state;
        // console.log('getInitialState...', this.props.module, this.props.model);
    },
    // componentWillReceiveProps(nextProps){
    //     this.setState({moduleCode: nextProps.module, modelCode: nextProps.model});
    //     console.log('componentWillReceiveProps...nextProps...', nextProps.module, nextProps.model);
    //     console.log('componentWillReceiveProps...state...', this.state.moduleCode, this.state.modelCode);
    // },
    componentWillReceiveProps: function (nextProps) {
        const self = this;
        this.setState({
            moduleCode: nextProps.module,
            modelCode: nextProps.model
        }, function () {
            self.createTableHeader(self.getModelData(function () {
                self.refreshTableRows()
            }));
        });
        // console.log(JSON.stringify(this.state));
    },
    componentDidMount(){
        // console.log('AdminTable...');
        const self = this;
        this.createTableHeader();
        this.getModelData(function () {
            self.setState({
                table: $('.ibird-table').DataTable({
                    language: Chinese,
                    columns: self.state.columns
                })
            }, function () {
                self.refreshTableRows();
            });
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
    createTableHeader(callback){
        const schema = this.props.schema;
        const obj = schema.obj;
        const colsTh = [], colsOrder = [], columns = [];
        Object.keys(obj).map(function (key) {
            if (!obj[key] || !obj[key].label) return;
            colsTh.push(<th key={key}>{obj[key].label}</th>);
            colsOrder.push(key);
            columns.push({data: key});
        });
        this.setState({colsTh: colsTh, colsOrder: colsOrder, columns: columns}, callback);
    },
    refreshTableRows(){
        const dinfo = this.state.dinfo;
        const colsOrder = this.state.colsOrder;
        const table = this.state.table;
        const trs = [], dataArray = [];
        if (!dinfo.data || !table) return;
        dinfo.data.map(function (item) {
            const tds = [], row = {};
            colsOrder.map(function (key) {
                tds.push(<td key={uuid.v4()}>{item[key]}</td>);
                row[key] = item[key] || '';
            });
            trs.push(<tr key={uuid.v4()}>{tds}</tr>);
            dataArray.push(row);
        });
        console.log(dataArray);
        table.clear().draw();
        table.rows.add(dataArray).draw();
    },
    render(){
        // console.log('模块编码 = ' + this.props.module);
        // console.log('路由指向 = ' + this.props.path);
        // console.log('模型编码 = ' + this.props.model);
        // console.log('数据模型 = ' + JSON.stringify(this.props.schema));

        // const ths = [], keysOrder = [], data = [];

        // if (this.state.dinfo.data) {
        //     this.state.dinfo.data.map(function (item) {
        //         const tds = [];
        //         keysOrder.map(function (key) {
        //             tds.push(<td key={uuid.v4()}>{item[key]}</td>);
        //         });
        //         data.push(<tr key={uuid.v4()}>{tds}</tr>);
        //     });
        // }
        // console.log(data);
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header">
                            <h3 className="box-title">{this.props.schema.label}</h3>
                        </div>
                        <div className="box-body">
                            <table className="table table-bordered table-striped display ibird-table">
                                <thead>
                                <tr>{this.state.colsTh}</tr>
                                </thead>
                                <tbody>
                                </tbody>
                                <tfoot>
                                <tr>{this.state.colsTh}</tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminTable;