/**
 * 主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const assign = require('object-assign');
const Link = require('react-router').Link;
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const FormFactory = require('FormFactory');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');
const config = require('ibird.config');

const AdminIndex = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        return {
            data: [],
            token: token,
            access_token: token.access_token
        };
    },
    componentWillMount(){
        this.fetchData();
    },
    componentDidMount(){
    },
    fetchData(){
        const self = this;
        const query = qs.stringify({access_token: this.state.access_token});
        fetch(RouteUtils.CUSTOM('/home') + '?' + query).then(res => res.json()).then(json => {
            if (json.err) return toastr.error(json.err.message, null, ToastrUtils.defaultOptions);
            self.setState({data: json});
            toastr.success('加载首页数据成功', null, assign({}, ToastrUtils.defaultOptions, {
                progressBar: true,
                preventDuplicates: true,
                timeOut: 1000,
                positionClass: "toast-top-center"
            }));
        });
    },
    _itemClickAction(e){
        const uri = e.target.getAttribute('data-uri') || e.target.parentNode.getAttribute('data-uri');
        if (!uri) return;
        this.context.router.push('/home' + uri);
    },
    render(){
        const self = this;
        const data = this.state.data;
        const boxColors = ['bg-aqua', 'bg-green', 'bg-yellow'];
        let format = _.random(1, 2);
        return (
            <div className="row">
                {data.map((item, i) => {
                    let color = boxColors[_.random(0, boxColors.length - 1)];
                    switch (format) {
                        case 1:
                            return (
                                <div key={i} className="col-md-3 col-sm-6 col-xs-12"
                                     onClick={self._itemClickAction}
                                     data-uri={item.uri}>
                                    <div className="info-box" data-uri={item.uri}>
                                        <span className={"info-box-icon " + color} data-uri={item.uri}>
                                            <i className={"fa fa-" + item.icon}></i>
                                        </span>
                                        <div className="info-box-content" data-uri={item.uri}>
                                            <span className="info-box-text" data-uri={item.uri}>
                                                <span style={{marginRight: '0.5rem'}}>{item.label}</span> <small>{item.code}</small>
                                            </span>
                                            <span className="info-box-number"
                                                  style={{fontSize: '2.5rem'}}>{item.total}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        case 2:
                            return (
                                <div key={i} className="col-md-3 col-sm-6 col-xs-12"
                                     onClick={self._itemClickAction}
                                     data-uri={item.uri}>
                                    <div className={"info-box " + color} data-uri={item.uri}>
                                        <span className="info-box-icon" data-uri={item.uri}>
                                            <i className={"fa fa-" + item.icon}></i></span>
                                        <div className="info-box-content" data-uri={item.uri}>
                                            <span className="info-box-text" data-uri={item.uri}>
                                                <span style={{marginRight: '0.5rem'}}>{item.label}</span>
                                                <small>{item.code}</small></span>
                                            <span className="info-box-number">{item.total}</span>

                                            <div className="progress" data-uri={item.uri}>
                                                <div className="progress-bar" style={{width: '100%'}}></div>
                                            </div>
                                            <span className="progress-description" style={{textAlign: 'right'}}>
                                                {/*70% Increase in 30 Days*/}
                                                <i className="fa fa-arrow-circle-right"
                                                   style={{fontSize: '2rem', textAlign: 'center'}}></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        case 3:
                            return (
                                <div key={i} className="col-lg-3 col-xs-6" onClick={self._itemClickAction}
                                     data-uri={item.uri}>
                                    <div className={"small-box " + color} data-uri={item.uri}>
                                        <div className="inner" data-uri={item.uri}>
                                            <h3>{item.total}</h3>
                                            <p data-uri={item.uri}>
                                                <span style={{
                                                    marginRight: '0.5rem',
                                                    fontWeight: 'bolder'
                                                }}>{item.label}</span>
                                                <small style={{textTransform: 'uppercase'}}>{item.code}</small>
                                            </p>
                                        </div>
                                        <div className="icon" data-uri={item.uri}>
                                            <i className={"fa fa-" + item.icon}></i>
                                        </div>
                                        <Link className="small-box-footer" to={'/home' + item.uri}
                                              style={{fontSize: '2rem'}}>
                                            <i className="fa fa-arrow-circle-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            );
                    }
                })}

            </div>
        );
    }
});

module.exports = AdminIndex;