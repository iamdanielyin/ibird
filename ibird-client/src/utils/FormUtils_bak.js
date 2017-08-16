/**
 * 表单工具模块
 * Created by yinfxs on 16-6-25.
 */
'use strict';

const React = require('react');
const _ = require('lodash');
const uuid = require('uuid');
const app = {};

module.exports = app;

app.string = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-string ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <input type="text" className="form-control" id={identifier}
                   placeholder={label} disabled={data.disabled}/>
        </div>
    );
};
app.password = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-password ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <input type="password" className="form-control" id={identifier}
                   placeholder={label} disabled={data.disabled}/>
        </div>
    );
};
app.number = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-number ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <input type="number" className="form-control" id={identifier}
                   placeholder={label} disabled={data.disabled}/>
        </div>
    );
};
app.textarea = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-textarea ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <textarea className="form-control" rows="3" placeholder={label} id={identifier}
                      style={{resize: 'vertical'}} disabled={data.disabled}></textarea>
        </div>
    );
};
app.editor = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-editor ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <div id={identifier} style={{minHeight: '400px'}}></div>
        </div>
    );
};
app.date = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-date ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label className="col-md-2 control-label">{label}</label>
            <div className="input-append date ibird-form-date">
                <input className="span2 form-control" type="text" id={identifier}
                       placeholder={label} disabled={data.disabled}/>
                <span className="add-on"><i className="icon-remove"></i></span>
                <span className="add-on"><i className="icon-th"></i></span>
            </div>
        </div>
    );
};
app.time = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-time ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label className="col-md-2 control-label">{label}</label>
            <div className="input-append date ibird-form-time">
                <input className="span2 form-control" type="text" id={identifier}
                       placeholder={label} disabled={data.disabled}/>
                <span className="add-on"><i className="icon-remove"></i></span>
                <span className="add-on"><i className="icon-th"></i></span>
            </div>
        </div>
    );
};
app.datetime = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-datetime ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label className="col-md-2 control-label">{label}</label>
            <div className="input-append date ibird-form-datetime">
                <input className="span2 form-control" type="text" id={identifier}
                       placeholder={label} disabled={data.disabled}/>
                <span className="add-on"><i className="icon-remove"></i></span>
                <span className="add-on"><i className="icon-th"></i></span>
            </div>
        </div>
    );
};
app['boolean-radios'] = function (label, identifier, data) {
    const optionArray = [];
    const name = uuid.v4();
    const options = data.items || {};
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight: '5px'}}>
                <input type="radio" className={identifier} value={key}
                       name={name} disabled={data.disabled}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    return (
        <div className={`form-group ibird-form-ctrltype-boolean-radios ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <div id={identifier + '-box'}>
                {optionArray}
            </div>
            <div className="pull-left"
                 style={{display: data.page ? 'block' : 'none', padding: '6px', color: '#ccc', fontSize: '14px'}}>
                <span id={identifier + '-page'}></span>
                <span id={identifier + '-totalpages'}></span>
                <span style={{margin: '0 5px'}}></span>
                <span id={identifier + '-totalelements'}></span>
            </div>
            <div className="ibird-icheck-actions" style={{display: data.page ? 'block' : 'none'}}>
                <i className="fa fa-caret-left" id={identifier + '-prepage'} aria-hidden="true"></i>
                <i className="fa fa-caret-right" id={identifier + '-nextpage'} aria-hidden="true"></i>
            </div>
        </div>
    );
};
app['boolean-checkbox'] = function (label, identifier, data) {
    const optionArray = [];
    const options = data.items || {};
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight: '5px'}}>
                <input type="checkbox" className={identifier} value={key} disabled={data.disabled}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    const buttonTextStyle = {marginLeft: '2px'};
    return (
        <div className={`form-group ibird-form-ctrltype-boolean-checkbox ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <br/>
            <div className="btn-group btn-group-xs">
                <button type="button" className="btn btn-default" id={identifier + '-select-display'}>
                    <i className="fa fa-check-square-o" aria-hidden="true"></i>
                    <span style={buttonTextStyle}>全选</span>
                </button>
                <button type="button" className="btn btn-default" id={identifier + '-select-invert'}>
                    <i className="fa fa-minus-square" aria-hidden="true"></i>
                    <span style={buttonTextStyle}>反选</span>
                </button>
                <button type="button" className="btn btn-default" id={identifier + '-select-clear'}>
                    <i className="fa fa-square-o" aria-hidden="true"></i>
                    <span style={buttonTextStyle}>清空</span>
                </button>
            </div>
            <div style={{marginBottom: '5px'}}></div>
            <div id={identifier + '-box'}>
                {optionArray}
            </div>
            <div className="pull-left"
                 style={{display: data.page ? 'block' : 'none', padding: '6px', color: '#ccc', fontSize: '14px'}}>
                <span id={identifier + '-page'}></span>
                <span id={identifier + '-totalpages'}></span>
                <span style={{margin: '0 5px'}}></span>
                <span id={identifier + '-totalelements'}></span>
            </div>
            <div className="ibird-icheck-actions" style={{display: data.page ? 'block' : 'none'}}>
                <i className="fa fa-caret-left" id={identifier + '-prepage'} aria-hidden="true"></i>
                <i className="fa fa-caret-right" id={identifier + '-nextpage'} aria-hidden="true"></i>
            </div>
        </div>
    );
};
app.ref = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-ref ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <select className="form-control" style={{width: '100%'}}
                    id={identifier} disabled={data.disabled}></select>
        </div>
    );
};
app.refs = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-refs ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <select className="form-control" multiple="multiple" style={{width: '100%'}}
                    id={identifier} disabled={data.disabled}></select>
        </div>
    );
};
app.file = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-file ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <input type="text" className="form-control" id={identifier}
                   placeholder={label} disabled={data.disabled}/>
        </div>
    );
};
app.files = function (label, identifier, data) {
    return (
        <div className={`form-group ibird-form-ctrltype-files ibird-form-group-keys ibird-form-group-${data.key}`} key={uuid.v4()}>
            <label>{label}</label>
            <input type="text" className="form-control" id={identifier}
                   placeholder={label} disabled={data.disabled}/>
        </div>
    );
};