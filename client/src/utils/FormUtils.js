/**
 * 表单工具模块
 * Created by yinfxs on 16-6-25.
 */
'use strict';

const React = require('react');
const uuid = require('node-uuid');

exports.string = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="text" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};
exports.password = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="password" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};
exports.number = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="number" className="form-control" id={identifier} placeholder={label}/>
    </div>;
};
exports.textarea = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <textarea className="form-control" rows="3" placeholder={label} id={identifier}
                  style={{resize:'vertical'}}></textarea>
    </div>
};
exports.date = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-date">
            <input className="span2 form-control" type="text" id={identifier} placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
exports.time = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-time">
            <input className="span2 form-control" type="text" id={identifier} placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
exports.datetime = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-datetime">
            <input className="span2 form-control" type="text" id={identifier} placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
exports['boolean-radios'] = function (label, identifier, options) {
    const optionArray = [];
    const name = uuid.v4();
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight:'5px'}}>
                <input type="radio" className={identifier} value={key} name={name}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    return <div className="form-group" key={uuid.v4()}><label>{label}</label><br/>{optionArray}</div>;
};
exports['boolean-checkbox'] = function (label, identifier, options) {
    const optionArray = [];
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight:'5px'}}>
                <input type="checkbox" className={identifier} value={key}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    return <div className="form-group" key={uuid.v4()}><label>{label}</label><br/>{optionArray}</div>;
};
//TODO 引用采用select2实现
exports.ref = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <select className="form-control" style={{width: '100%'}} id={identifier}></select>
    </div>;
};
//TODO 引用采用select2实现
exports.refs = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <select className="form-control" multiple="multiple" style={{width: '100%'}}
                id={identifier}></select>
    </div>;
};
//TODO 未实现
exports.file = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="file" className="form-control" id={identifier}/>
    </div>;
};
//TODO 未实现
exports.files = function (label, identifier) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="file" className="form-control" id={identifier}/>
    </div>;
};