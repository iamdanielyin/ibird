/**
 * 表单工具模块
 * Created by yinfxs on 16-6-25.
 */
'use strict';

const React = require('react');
const _ = require('lodash');
const uuid = require('node-uuid');
const app = {};

module.exports = app;

app.string = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="text" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};
app.password = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="password" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};
app.number = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="number" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};
app.textarea = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <textarea className="form-control" rows="3" placeholder={label} id={identifier}
                  style={{resize: 'vertical'}}></textarea>
    </div>
};
app.date = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-date">
            <input className="span2 form-control" type="text" id={identifier} placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
app.time = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-time">
            <input className="span2 form-control" type="text" id={identifier} placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
app.datetime = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-datetime">
            <input className="span2 form-control" type="text" id={identifier} placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
app['boolean-radios'] = function (label, identifier, data) {
    const optionArray = [];
    const name = uuid.v4();
    const options = data.items || {};
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight: '5px'}}>
                <input type="radio" className={identifier} value={key} name={name}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <div id={identifier + '-box'}>
            {optionArray}
        </div>
        <div className="ibird-icheck-actions" style={data.page ? {display: 'block'} : {display: 'none'}}>
            <i className="fa fa-caret-left" id={identifier + '-prepage'} aria-hidden="true"></i>
            <i className="fa fa-caret-right" id={identifier + '-nextpage'} aria-hidden="true"></i>
        </div>
    </div>;
};
app['boolean-checkbox'] = function (label, identifier, data) {
    const optionArray = [];
    const options = data.items || {};
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight: '5px'}}>
                <input type="checkbox" className={identifier} value={key}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <div id={identifier + '-box'}>
            {optionArray}
        </div>
        <div className="ibird-icheck-actions" style={data.page ? {display: 'block'} : {display: 'none'}}>
            <i className="fa fa-caret-left" id={identifier + '-prepage'} aria-hidden="true"></i>
            <i className="fa fa-caret-right" id={identifier + '-nextpage'} aria-hidden="true"></i>
        </div>
    </div>;
};
app.ref = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <select className="form-control" style={{width: '100%'}} id={identifier}></select>
    </div>;
};
app.refs = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <select className="form-control" multiple="multiple" style={{width: '100%'}}
                id={identifier}></select>
    </div>;
};
app.file = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="text" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};
app.files = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="text" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};