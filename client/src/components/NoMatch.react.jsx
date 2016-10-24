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
            <div className="error-page">
                <h2 className="headline text-yellow"> 404</h2>
                <div className="error-content">
                    <h3><i className="fa fa-warning text-yellow"></i> 额...你好像来错地方了～～</h3>
                    <p>
                        找不到你想要的页面哦，你可以选择<Link to="/home">回到主页</Link>或者在下面搜索
                    </p>
                    <form className="search-form">
                        <div className="input-group">
                            <input type="text" name="search" className="form-control" placeholder="请输入查找关键字"/>
                            <div className="input-group-btn">
                                <button type="submit" name="submit" className="btn btn-warning btn-flat"><i
                                    className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

module.exports = NoMatch;