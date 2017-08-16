/**
 * 菜单组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');
const JSONEditor = require('jsoneditor/dist/jsoneditor.min');

const AdminLink = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        const token = JSON.parse(localStorage.getItem('access_token') || '{}');
        token.data = token.data || {};
        return {
            token: token,
            access_token: token.access_token,
            data: {},
            roles: token.data.roles,
            org: token.data.org,
            editor: null,
        };
    },
    fetchMenu(){
        console.log('fetchMenu...');
        const data = this.state.data;
        const query = qs.stringify({
            def: 1,
            cond: {code: 'MENU'},
            access_token: this.state.access_token
        });
        toastr.info('获取数据中，请稍后...', null, assign({},ToastrUtils.defaultOptions, {progressBar: false, preventDuplicates: true, timeOut: 800}));
        fetch(RouteUtils.CUSTOM('/preset/param' + '?' + query)).then(function (res) {
            return res.json();
        }).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            json = json && _.isArray(json.data) && json.data.length > 0 ? json.data[0] : data;
            this.setState({data: json}, ()=> this.initJSONEditor(json.value));
        });
    },
    fetchSave(json = {}){
        const data = this.state.data;
        data.value = json;
        const query = qs.stringify({
            access_token: this.state.access_token
        });
        fetch(RouteUtils.CUSTOM('/preset/param' + '?' + query), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            return res.json();
        }).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            toastr.success('保存成功', null, ToastrUtils.defaultOptions);
        });
    },
    initJSONEditor(json = {}){
        let editor = this.state.editor;
        if (editor) editor.destroy();
        //新建编辑器
        const container = document.getElementById("ibird-menu-jsoneditor");
        const options = {modes: ['tree', 'view', 'form', 'code', 'text'], mode: 'tree'};
        editor = new JSONEditor(container, options);
        //设置数据
        editor.set(json);
        editor.expandAll();
        this.setState({editor: editor});
    },
    _onSaveAction(e){
        const editor = this.state.editor;
        if (!editor) return;
        const json = editor.get();
        this.fetchSave(json);
    },
    componentWillMount(){
    },
    componentDidMount(){
        this.fetchMenu();
    },
    render(){
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header">
                            <h3 className="box-title">系统菜单</h3>
                        </div>
                        <div className="box-body">
                            <div id="ibird-menu-jsoneditor"></div>
                        </div>
                        <div className="box-footer clearfix">
                            <button type="button" className="btn btn-primary" onClick={this._onSaveAction}>保存</button>
                            <button type="button" className="btn btn-default">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminLink;