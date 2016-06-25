/**
 * 路由捕手组件
 * 捕获所有界面上的路由响应
 * Created by yinfxs on 16-6-21.
 */

'use strict';

const React = require('react');
const AdminIndex = require('./AdminIndex.react');
const AdminTable = require('./AdminTable.react');
const AdminForm = require('./AdminForm.react');
const CodeUtils = require('../utils/CodeUtils');
const cv = JSON.parse(CodeUtils.decodeBase64(localStorage.getItem('C_V'), 5)) || [];

const RouteCatcher = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return {}
    },
    componentDidMount(){
        console.log('RouteCatcher...');

    },
    getSchemaByCode(moduleCode, modelCode){
        let schema = {};
        cv.map(function (module) {
            if (!module || module.code != moduleCode) return;
            const schemas = module.schemas;
            Object.keys(schemas).map(function (key) {
                if (!key || key != modelCode) return;
                schema = schemas[key];
            });
        });
        return schema;
    },
    render(){
        const props = this.props;
        const module = props.params.module;
        const path = props.params.path;
        const query = props.location.query;
        const schema = this.getSchemaByCode(module, query.m);
        const f = query.f;
        const i = query.i;
        return (
            !f ? <AdminTable module={module} path={path} model={query.m} schema={schema}/> :
                <AdminForm module={module} path={path} model={query.m} schema={schema} i={i}/>
        );
    }
});


module.exports = RouteCatcher;