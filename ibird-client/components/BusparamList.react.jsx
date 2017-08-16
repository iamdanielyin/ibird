/**
 * 自定义组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const _ = require('lodash');
const qs = require('qs');
const uuid = require('uuid');

const style = {
    backgroundColor: '#d2d6de',
    border: 0,
    minHeight: '46rem'
};


const BusparamList = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        let token = localStorage.getItem('access_token');
        if (token) token = JSON.parse(token);
        return {
            token: token,
            access_token: token.access_token
        };
    },
    componentWillMount(){
    },
    componentDidMount(){
    },
    render(){
        const self = this;
        const item = this.props.item;
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box">
                        <div className="box-header">
                            <h3 className="box-title">{item.label}</h3>
                        </div>
                        <div className="box-body table-responsive no-padding">
                            <h3>自定义列表组件</h3>
                        </div>
                        <div className="box-footer clearfix"></div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = BusparamList;