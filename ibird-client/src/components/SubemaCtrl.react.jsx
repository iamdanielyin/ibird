/**
 * 嵌套子表控件类型
 * Created by yinfxs on 16-12-18.
 */

const React = require('react');
const assign = require('object-assign');
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');
const Table = require('Table');
const Form = require('Form');

const SubemaCtrl = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const token = JSON.parse(localStorage.getItem('access_token') || '{}');
        return {
            token: token,
            access_token: token.access_token
        };
    },
    getValue(){
        //获取表格值
        return this.refs.table.getValue();
    },
    setValue(data){
        //设置表格值
        this.refs.table.setValue(data);
    },
    rowSelection(value){
        //点击行更新表单
        this.refs.form.setValue(value.data);
    },
    _onFormSaveAction(value){
        //表单保存更新表格
        this.refs.table.saveValue(value);
    },
    render(){
        const schema = this.props.schema;
        const view = this.props.view;
        return (
            <div className="box box-solid">
                <div className="box-header with-border"
                     style={{display: this.props.label ? 'block' : 'none'}}>
                    <h3 className="box-title">{this.props.label}</h3>
                </div>
                <div className="box-body">
                    <Form schema={schema} ref='form' getValue={this._onFormSaveAction} view={view}/>
                    <Table schema={schema} ref='table' rowSelection={this.rowSelection} view={view}/>
                </div>
            </div>
        );
    }
});
module.exports = SubemaCtrl;