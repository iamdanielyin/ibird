/**
 * 主页组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');

const AdminIndex = React.createClass({
    render(){
        return (
            <div className="row">
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua">
                            <i className="fa fa-google"></i>
                        </span>
                        <div className="info-box-content">
                            <span className="info-box-text">
                                <span>用户</span> <small>user</small>
                            </span>
                            <span className="info-box-number">41,410</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-red">
                            <i className="fa fa-google"></i>
                        </span>
                        <div className="info-box-content">
                            <span className="info-box-text">
                                <span>参数</span> <small>param</small>
                            </span>
                            <span className="info-box-number">40</span>
                        </div>
                    </div>
                </div>
                <div className="clearfix visible-sm-block"></div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-green">
                            <i className="fa fa-google"></i>
                        </span>
                        <div className="info-box-content">
                            <span className="info-box-text">Sales</span>
                            <span className="info-box-number">760</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-yellow">
                            <i className="fa fa-google"></i>
                        </span>
                        <div className="info-box-content">
                            <span className="info-box-text">New Members</span>
                            <span className="info-box-number">2,000</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminIndex;