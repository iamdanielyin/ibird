/**
 * 路由捕手组件
 * 捕获所有界面上的路由响应
 * Created by yinfxs on 16-6-21.
 */

'use strict';

const React = require('react');
const uuid = require('uuid');
const AdminIndex = require('AdminIndex');
const AdminTable = require('AdminTable');
const AdminMenu = require('AdminMenu');
const AdminForm = require('AdminForm');
const AdminLink = require('AdminLink');
const CodeUtils = require('CodeUtils');

const AdminCustom = require('defcomponent');
const BusparamList = require('busparamList');
const BusparamForm = require('busparamForm');


const RouteCatcher = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    childContextTypes: {
        location: React.PropTypes.object
    },
    getChildContext() {
        return {location: this.props.location}
    },
    getInitialState(){
        const cv = JSON.parse(CodeUtils.decodeBase64(localStorage.getItem('C_V') || '{}', 5)) || [];
        return {cv: cv}
    },
    getSchemaByCode(moduleCode, modelCode){
        const cv = this.state.cv || {};
        let schema = {};
        const modules = cv.modules || [];
        modules.map(function (module) {
            if (!module || module.code != moduleCode) return;
            const schemas = module.schemas || [];
            schemas.map(function (item) {
                if (!item || item.code != modelCode) return;
                schema = item;
            });
        });
        return schema;
    },
    render(){
        const location = this.props.location || {};
        const query = location.query || {};
        const state = location.state || {};
        const params = this.props.params || {};
        const module = params.module;
        const path = params.path;
        const item = state.item || {};

        const schema = this.getSchemaByCode(module, path);
        const f = schema && schema.singleton == true ? uuid.v1() : query.f, i = query.i;
        if (item.out) return window.open(item.uri);

        let com = state.com, content;

        if(item.list) com = item.list;
        if(f && item.form) com = item.form;
        switch (com) {
            case 'defcomponent':content=<AdminCustom module={module} path={path} model={path} schema={schema} item={item} i={i}/>;break;case 'busparamList':content=<BusparamList module={module} path={path} model={path} schema={schema} item={item} i={i}/>;break;case 'busparamForm':content=<BusparamForm module={module} path={path} model={path} schema={schema} item={item} i={i}/>;break;
            case 'link':
                content = <AdminLink module={module} path={path} model={path} schema={schema} item={item}/>;
                break;
            case 'menu':
                content = <AdminMenu/>;
                break;
            default:
                if (f) {
                    content = <AdminForm module={module} path={path} model={path} schema={schema} item={item} i={i}/>;
                } else {
                    content = <AdminTable module={module} path={path} model={path} schema={schema} item={item}/>;
                }
                break;
        }
        return content;
    }
});

module.exports = RouteCatcher;