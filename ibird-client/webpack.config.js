/**
 * webpack开发配置文件
 */

'use strict';

const path = require('path');
const fs = require('fs');
const fsx = require('fs-extra');
const uuid = require('uuid');
const assign = require('object-assign');
const babel = require('babel-core');
const _ = require('lodash');
const webpack = require('webpack');
const isProduction = (process.env['NODE_ENV'] == 'production') ? true : false;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const source_dir = path.resolve(__dirname, 'src');
var dist_dir = path.resolve(__dirname, (isProduction ? 'dist' : 'build'));

const skins = ['skin-blue', 'skin-blue-light', 'skin-yellow', 'skin-yellow-light', 'skin-green', 'skin-green-light', 'skin-purple', 'skin-purple-light', 'skin-red', 'skin-red-light', 'skin-black', 'skin-black-light'];

const alias = {
    'bootstrap': path.resolve(__dirname, 'src/public/lib/bootstrap/js/bootstrap' + (isProduction ? '.min.' : '.') + 'js'),
    'adminlte': path.resolve(__dirname, 'src/public/lib/adminlte/js/AdminLTE' + (isProduction ? '.min.' : '.') + 'js'),
    'toastr': path.resolve(__dirname, 'src/public/plugins/toastr/toastr.min.js'),
    'icheck': path.resolve(__dirname, 'src/public/plugins/iCheck/icheck.js'),
    'datetimepicker': path.resolve(__dirname, 'src/public/plugins/datetimepicker/js/bootstrap-datetimepicker.min.js'),
    'select2': path.resolve(__dirname, 'src/public/plugins/select2/select2.full.js'),
    'jquery.fileupload': path.resolve(__dirname, 'src/public/plugins/jqueryFileUpload/jquery.fileupload.js'),
    'jquery.iframe-transport': path.resolve(__dirname, 'src/public/plugins/jqueryFileUpload/jquery.iframe-transport.js'),
    'jquery.ui.widget': path.resolve(__dirname, 'src/public/plugins/jqueryFileUpload/jquery.ui.widget.js'),
    'RouteCatcher': path.resolve(__dirname, 'src/components/RouteCatcher.react.jsx'),
    'Admin': path.resolve(__dirname, 'src/components/Admin.react.jsx'),
    'AdminForm': path.resolve(__dirname, 'src/components/AdminForm.react.jsx'),
    'AdminIndex': path.resolve(__dirname, 'src/components/AdminIndex.react.jsx'),
    'AdminLink': path.resolve(__dirname, 'src/components/AdminLink.react.jsx'),
    'AdminTable': path.resolve(__dirname, 'src/components/AdminTable.react.jsx'),
    'AdminMenu': path.resolve(__dirname, 'src/components/AdminMenu.react.jsx'),
    'App': path.resolve(__dirname, 'src/components/App.react.jsx'),
    'Forgot': path.resolve(__dirname, 'src/components/Forgot.react.jsx'),
    'NoMatch': path.resolve(__dirname, 'src/components/NoMatch.react.jsx'),
    'Signin': path.resolve(__dirname, 'src/components/Signin.react.jsx'),
    'Signup': path.resolve(__dirname, 'src/components/Signup.react.jsx'),
    'Table': path.resolve(__dirname, 'src/components/Table.react.jsx'),
    'Form': path.resolve(__dirname, 'src/components/Form.react.jsx'),
    'RouteUtils': path.resolve(__dirname, 'src/utils/RouteUtils.js'),
    'CodeUtils': path.resolve(__dirname, 'src/utils/CodeUtils.js'),
    'FormFactory': path.resolve(__dirname, 'src/utils/FormFactory.js'),
    'FormUtils': path.resolve(__dirname, 'src/utils/FormUtils.js'),
    'RequireUtils': path.resolve(__dirname, 'src/utils/RequireUtils.js'),
    'ToastrUtils': path.resolve(__dirname, 'src/utils/ToastrUtils.js'),
    'SubemaCtrl': path.resolve(__dirname, 'src/components/SubemaCtrl.react.jsx')
};

/**
 * 文件模板替换
 * @param tplpath 模板文件地址
 * @param destpath 模板文件地址
 * @param vars 变量内容对象
 */
function fileTemplateReplace(tplpath, destpath, vars) {
    let data;
    try {
        data = fs.readFileSync(tplpath);
    } catch (e) {
        return console.log(i18n.value('doc_template_error', [e.message]));
    }
    if (!data) return console.log(i18n.value('doc_template_error', [tplpath]));
    let content = data.toString();
    _.keys(vars).map(function (key) {
        if (!key) return;
        content = content.replace(new RegExp('\\${\\s*' + key + '\\s*}', 'g'), vars[key]);
    });
    fs.writeFileSync(destpath, content);
}

module.exports = function (config_path, dist) {
    //处理ibird.config.js - begin：注册组件、配置文件
    const default_path = path.resolve(__dirname, 'src/templates/ibird.config.js');
    config_path = config_path || default_path;
    dist_dir = dist || dist_dir;
    //处理自定义ibird.config.js文件
    let config = {}, user_config = {}, default_config = {};
    if (config_path) {
        const tmpPath = path.resolve(__dirname, uuid.v1() + '.js');
        fsx.outputFileSync(tmpPath, babel.transformFileSync(config_path, {
            presets: ["react"]
        }).code);
        try {
            user_config = require(tmpPath);
        } finally {
            fsx.removeSync(tmpPath);//删除临时文件
        }
    }
    if (default_path) {
        const tmpPath = path.resolve(__dirname, uuid.v1() + '.js');
        fsx.outputFileSync(tmpPath, babel.transformFileSync(default_path, {
            presets: ["react"]
        }).code);
        try {
            default_config = require(tmpPath);
        } finally {
            fsx.removeSync(tmpPath);//删除临时文件
        }
    }
    assign(config, default_config, user_config);
    alias['ibird.config'] = config_path;
    //设置自定义组件别名
    let title = 'ibird';
    let template = path.resolve(__dirname, 'src/templates/index.ejs');
    let skin = 'skin-black-light';

    if (config) {
        title = config.title || config.name || title;
        template = config.template || template;
        alias['custom-less'] = config.less || path.resolve(__dirname, 'src/public/css/custom.less');
        skin = skins.indexOf(config.skin) != -1 ? config.skin : skin;
        const components = config.components || [];
        const requires = [];
        const cases = [];
        components.forEach(function (item) {
            if (!item || !item.code) return;
            alias[item.code] = item.path;
            if (!item.name || !item.path) return;
            requires.push(`const ${item.name} = require('${item.code}');\n`);
            cases.push(`case '${item.code}':content=<${item.name} module={module} path={path} model={path} schema={schema} item={item} i={i}/>;break;`);
        });
        //修改RouteCatcher.react.jsx文件
        const src = path.resolve(__dirname, 'src/components/RouteCatcher.react.jsx.template');
        const dest = path.resolve(__dirname, 'src/components/RouteCatcher.react.jsx');
        fileTemplateReplace(src, dest, {
            requires: requires.join(''),
            cases: cases.join('')
        });
    }
    //处理插件 - begin
    const plugins = [
        new HtmlWebpackPlugin({
            title: title,
            skin: skin,
            template: template
        }),
        new webpack.ProvidePlugin({
            toastr: "toastr",
            "slimscroll": "jquery-slimscroll"
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors' + (isProduction ? '.min.' : '.') + 'js'),
        new ExtractTextPlugin('style.css', {
            allChunks: true
        })
    ];

    if (isProduction) {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.DedupePlugin()
        );
    }
    //处理插件 - end
    //处理ibird.config.js - end

    //返回webpack配置
    return {
        entry: {
            polyfill: ['babel-polyfill'],
            app: ['whatwg-fetch', path.resolve(__dirname, 'src/index.jsx')],
            vendors: ['react', 'react-router', 'react-dom', 'jquery', 'uuid', 'object-assign', 'qs', 'lodash', 'moment']
        },
        output: {
            path: dist_dir,
            filename: '[name]' + (isProduction ? '.min.' : '.') + 'js'
        },
        module: {
            loaders: [
                {
                    test: /\.(jsx|js)?$/,
                    loader: 'babel',
                    // include: source_dir,
                    // exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react', 'stage-3'],
                        compact: false
                    }
                },
                {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less-loader')
                },
                {test: /\.json$/, loader: 'json'},
                {test: /\.png$/, loader: 'url?limit=8192&mimetype=image/png'},
                {test: /\.jpe?g$/, loader: 'url?limit=8192&mimetype=image/jpg'},
                {test: /\.gif$/, loader: 'url?limit=8192&mimetype=image/gif'},
                {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=image/svg+xml'},
                {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff2'},
                {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff'},
                {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/octet-stream'},
                {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
                {test: /\.svg(\?\-qdfu1s)?$/, loader: 'url?limit=8192&mimetype=image/svg+xml'},
                {test: /\.woff(\?\-qdfu1s)?$/, loader: 'url?limit=8192&mimetype=application/font-woff'},
                {test: /\.ttf(\?\-qdfu1s)?$/, loader: 'url?limit=8192&mimetype=application/octet-stream'},
                {test: /\.eot(\?\-qdfu1s)?$/, loader: 'file'},
                {test: /\.svg$/, loader: 'file'}
            ]
        },
        plugins: plugins,
        resolve: {
            root: path.resolve('src'),
            modulesDirectories: ['node_modules'],
            extensions: ['', '.js', '.jsx'],
            alias: alias
        },
        externals: []
    };
};
