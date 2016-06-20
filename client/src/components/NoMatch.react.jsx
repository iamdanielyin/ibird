/**
 * 未知路由组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');

const NoMatch = React.createClass({
    render(){
        return <div>未匹配路由</div>
    }
});

module.exports = NoMatch;