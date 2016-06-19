/**
 * 按钮组件类
 */

'use strict';

const React = require('react');

const MyButton = React.createClass({
    render(){
        const items = this.props.items;
        const itemHtml = items.map(function (listItem, i) {
            return <li key={i}>{listItem}</li>;
        });

        return <div>
            <ul>{itemHtml}</ul>
            <button onClick={this.props.onClick}>新增</button>
        </div>;
    }
});

module.exports = MyButton;
