/**
 * ibird配置文件
 * Created by yinfxs on 16-10-11.
 */

'use strict';

const uuid = require('uuid');
const path = require('path');
const React = require('react');

module.exports = {
    less: path.resolve(__dirname, 'src/public/css/custom.less'),
    controls: {
        'table': {
            init: (ctx) => {
                //初始化
            },
            onload: (ctx) => {
                //加载组件
            },
            validate: (ctx) => {
                //验证
            },
            setValue: (ctx) => {
                //设置值
            },
            getValue: (ctx) => {
                //获取值
            }
        }
    },
    models: {
        'preset-commdl': {
            'hooks': {
                'list': {
                    'onload': (ctx, callback) => {
                        const $this = ctx.$this;
                        const pagingParams = $this.state.pagingParams;
                        const defviews = $this.state.defviews;
                        const actions = $this.state.actions;
                        // pagingParams.cond = {text: '哈哈'};

                        const aid = uuid.v1();
                        const action = function (ctx) {
                            toastr.info('确定', null, ctx.ToastrUtils.defaultOptions);
                        };
                        actions[aid] = {action: action};

                        $('#defModal').on('shown.bs.modal', function (e) {
                            console.log('显示后...');
                        }.bind(this));

                        defviews.push(
                            <div key={1} className="modal fade" id="defModal" tabIndex="-1" role="dialog"
                                 aria-labelledby="defModal"
                                 aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal"><span
                                                aria-hidden="true">&times;</span><span className="sr-only">关闭</span>
                                            </button>
                                            <h4 className="modal-title" id="uploadModal">自定义模态框</h4>
                                        </div>
                                        <div className="modal-body">
                                            <ol>
                                                <li>操作1</li>
                                                <li>操作2</li>
                                            </ol>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-default"
                                                    data-dismiss="modal">取消
                                            </button>
                                            <button type="button" className="btn btn-primary" data-aid={aid}
                                                    onClick={$this._defActions}>确定
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                        $this.setState({
                            actions: actions,
                            pagingParams: pagingParams,
                            defviews: defviews,
                            'refreshInterval': setInterval(() => {
                                toastr.success('定时弹框...' + $this.state.moduleCode + '-' + $this.state.modelCode, null, ctx.ToastrUtils.defaultOptions);
                            }, 2000)
                        }, callback);
                    },
                    'onleave': (ctx) => {
                        toastr.info('表格离开...', null, ctx.ToastrUtils.defaultOptions);
                        clearInterval(ctx.$this.state.refreshInterval);
                    }
                },
                'form': {
                    'onload': (ctx) => {
                        toastr.info('表单加载...', null, ctx.ToastrUtils.defaultOptions);
                    },
                    'onleave': (ctx) => {
                        toastr.info('表单离开...', null, ctx.ToastrUtils.defaultOptions);
                    }
                }
            },
            'toolbar': [
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       data-toggle="modal"
                                       data-target="#defModal" data-backdrop="false"
                                       onClick={ctx.action}>打开模态框</button>;
                    },
                    action: function (ctx) {
                        // toastr.info('权限按钮1', null, ctx.ToastrUtils.defaultOptions);
                    }
                },
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       onClick={ctx.action}>获取选中行</button>;
                    },
                    action: function (ctx) {
                        const rows = ctx.$this.getSelectedRows();
                        console.log(JSON.stringify(rows,null,2));
                    }
                },
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       onClick={ctx.action}>获取显示行</button>;
                    },
                    action: function (ctx) {
                        const rows = ctx.$this.getSelectedRows();
                        console.log(JSON.stringify(rows,null,2));
                    }
                },
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       onClick={ctx.action}>工具栏按钮2</button>;
                    },
                    action: function (ctx) {
                        console.log(ctx.data);
                        alert('工具栏按钮2');
                    }
                },
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       onClick={ctx.action}>工具栏按钮1</button>;
                    },
                    action: function (ctx) {
                        console.log(ctx.data);
                        alert('工具栏按钮1');
                    }
                },
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       onClick={ctx.action}>工具栏按钮2</button>;
                    },
                    action: function (ctx) {
                        console.log(ctx.data);
                        alert('工具栏按钮2');
                    }
                },
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       onClick={ctx.action}>工具栏按钮1</button>;
                    },
                    action: function (ctx) {
                        console.log(ctx.data);
                        alert('工具栏按钮1');
                    }
                },
                {
                    render: function (ctx) {
                        return <button className="btn btn-default btn-sm"
                                       onClick={ctx.action}>工具栏按钮2</button>;
                    },
                    action: function (ctx) {
                        console.log(ctx.data);
                        alert('工具栏按钮2');
                    }
                },
                {
                    render: function (ctx) {
                        return <input type="email" className="form-control" placeholder="Enter email"
                                      onChange={ctx.action}/>;
                    },
                    action: function (ctx) {
                        console.log(ctx.data);
                        alert('工具栏按钮2');
                    }
                }
            ],
            'actions': [
                {
                    label: '自定义按钮',
                    render: function (ctx) {
                        return <button className="btn btn-default btn-xs"
                                       onClick={ctx.action}>自定义按钮</button>;
                    },
                    action: function (ctx) {
                        alert(JSON.stringify(ctx.data));
                    }
                },
                {
                    label: '自定义按钮',
                    render: function (ctx) {
                        return <button className="btn btn-default btn-xs"
                                       onClick={ctx.action}>自定义按钮</button>;
                    },
                    action: function (ctx) {
                        alert(JSON.stringify(ctx.data));
                    }
                }
            ],
            'fields': {
                'text': {
                    label: '文本类型',
                    column: function (ctx) {
                        return <div style={{backgroundColor: '#8c8c8c', color: '#fff'}}>{ctx.data}</div>;
                    },
                    row: function (ctx) {
                        return <div style={{backgroundColor: '#3c8dbc', color: '#fff'}}>{ctx.data}</div>;
                    }
                },
                'booleanRadios': {
                    row: function (ctx) {
                        const value = ctx.row[ctx.key] || '';
                        return <div
                            style={value == 'b' ? {backgroundColor: '#8c8c8c', color: '#fff'} : {}}>{ctx.data}</div>;
                    }
                }
            }
        },
    },
    components: [
        {
            code: 'defcomponent',
            name: 'AdminCustom',
            path: path.join(__dirname, 'components', 'AdminCustom.react.jsx')
        },
        {
            code: 'busparamList',
            name: 'BusparamList',
            path: path.join(__dirname, 'components', 'BusparamList.react.jsx')
        },
        {
            code: 'busparamForm',
            name: 'BusparamForm',
            path: path.join(__dirname, 'components', 'BusparamForm.react.jsx')
        },
        {
            code: 'Signin',
            path: path.join(__dirname, 'components', 'Signin.react.jsx')
        }
    ]
};