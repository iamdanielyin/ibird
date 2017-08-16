/**
 * 未知路由组件
 * Created by yinfxs on 16-6-14.
 */

'use strict';

const React = require('react');
const Link = require('react-router').Link;

const NoMatch = React.createClass({
    render(){
        return (
            <div className="error-page" style={{textAlign: 'center'}}>
                <h2 className="headline text-yellow"> 404</h2>
                <div className="error-content" style={{paddingTop: '2rem', marginLeft: '0'}}>
                    <h3><i className="fa fa-warning text-yellow"></i> 额...你好像来错地方了～</h3>
                    <p>
                        找不到你想要的页面哦，你可以选择<Link to="/home">回到主页</Link>或<Link to="/signin">重新登录</Link>
                    </p>
                </div>
            </div>
        );
    }
});

module.exports = NoMatch;