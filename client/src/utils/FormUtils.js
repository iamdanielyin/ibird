/**
 * 表单工具模块
 * Created by yinfxs on 16-6-25.
 */
'use strict';

const React = require('react');
const uuid = require('node-uuid');

exports.string = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="text" className="form-control" placeholder={label}/>
    </div>;
};
exports.password = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="password" className="form-control" placeholder={label}/>
    </div>;
};
exports.number = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="number" className="form-control" placeholder={label}/>
    </div>;
};
exports.textarea = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <textarea className="form-control" rows="3" placeholder={label}></textarea>
    </div>
};
exports.date = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-date">
            <input className="span2 form-control" type="text" placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
exports.time = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-time">
            <input className="span2 form-control" type="text" placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
exports.datetime = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label className="col-md-2 control-label">{label}</label>
        <div className="input-append date ibird-form-datetime">
            <input className="span2 form-control" type="text" placeholder={label}/>
            <span className="add-on"><i className="icon-remove"></i></span>
            <span className="add-on"><i className="icon-th"></i></span>
        </div>
    </div>;
};
exports['boolean-radios'] = function (label, options) {
    const optionArray = [];
    const name = uuid.v4();
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight:'5px'}}>
                <input type="radio" className="ibird-form-radios" name={name} value={key}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    return <div className="form-group" key={uuid.v4()}><label>{label}</label><br/>{optionArray}</div>;
};
exports['boolean-checkbox'] = function (label, options) {
    const optionArray = [];
    Object.keys(options).map(function (key) {
        if (!key || !options[key]) return;
        optionArray.push(
            <label key={uuid.v4()} style={{marginRight:'5px'}}>
                <input type="checkbox" className="ibird-form-checkbox" value={key}/>
                <span>{options[key]}</span>
            </label>
        );
    });
    return <div className="form-group" key={uuid.v4()}><label>{label}</label><br/>{optionArray}</div>;
};
//TODO 引用采用select2实现
exports.ref = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <select className="form-control ibird-form-ref" placeholder={label} defaultValue="Alabama"
                style={{width: '100%'}}>
            <option defaultValue="Alabama" key="Alabama">Alabama</option>
            <option defaultValue="Alaska" key="Alaska">Alaska</option>
            <option defaultValue="California" key="California">California</option>
            <option defaultValue="Delaware" key="Delaware">Delaware</option>
            <option defaultValue="Tennessee" key="Tennessee">Tennessee</option>
            <option defaultValue="Texas" key="Texas">Texas</option>
            <option defaultValue="Washington" key="Washington">Washington</option>
        </select>
    </div>;
};
//TODO 引用采用select2实现
exports.refs = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <select className="form-control ibird-form-refs" multiple="multiple" placeholder={label}
                defaultValue={['Alabama']}
                style={{width: '100%'}}>
            <option defaultValue="Alabama" key="Alabama">Alabama</option>
            <option defaultValue="Alaska" key="Alaska">Alaska</option>
            <option defaultValue="California" key="California">California</option>
            <option defaultValue="Delaware" key="Delaware">Delaware</option>
            <option defaultValue="Tennessee" key="Tennessee">Tennessee</option>
            <option defaultValue="Texas" key="Texas">Texas</option>
            <option defaultValue="Washington" key="Washington">Washington</option>
        </select>
    </div>;
};
//TODO 未实现
exports.file = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="file" className="form-control"/>
    </div>;
};
//TODO 未实现
exports.files = function (label) {
    return <div className="form-group" key={uuid.v4()}>
        <label>{label}</label>
        <input type="file" className="form-control"/>
    </div>;
};