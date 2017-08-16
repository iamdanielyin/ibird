'use strict';


/**
 * 权限分配组件
 * Created by yinfxs on 2017/4/10.
 */

const React = require('react');
const Link = require('react-router').Link;
const RouteUtils = require('RouteUtils');
const ToastrUtils = require('ToastrUtils');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');

const AdminAssign = React.createClass({
    contextTypes: {
        router: React.PropTypes.object,
        location: React.PropTypes.object
    },
    getInitialState(){
        const token = JSON.parse(localStorage.getItem('access_token') || '{}');
        const location = this.context.location || {};
        const state = location.state || {};
        const query = location.query || {};
        return {
            _id: token._id,
            token: token,
            access_token: token.access_token,
            roles: token.data.roles,
            org: token.data.org
        };
    },
    componentWillMount(){
    },
    componentDidMount(){
    },
    render(){
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header">
                            <h3 className="box-title">权限分配</h3>
                        </div>
                        <div className="box-body table-responsive no-padding">

                        </div>
                        <div className="box-footer clearfix"></div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminAssign;