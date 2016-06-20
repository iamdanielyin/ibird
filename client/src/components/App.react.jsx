/**
 * 入口组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;

const App = React.createClass({
    render(){
        return <div className="mainContent">
            {this.props.children}
        </div>;
    }
});

module.exports = App;