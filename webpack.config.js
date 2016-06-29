/**
 * webpack开发配置文件
 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const isProduction = (process.env.NODE_ENV == 'production') ? true : false;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SOURCEDIR = path.resolve(__dirname, 'client/src');
const DISTDIR = path.resolve(__dirname, 'client/' + (isProduction ? 'dist' : 'build'));

const plugins = [
    new HtmlWebpackPlugin({
        title: 'Hello ibird!',
        template: path.resolve(__dirname, 'client/src/templates/index.ejs')
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        toastr: "toastr",
        "slimscroll": "jquery-slimscroll"
    }),
    new webpack.IgnorePlugin(/(AdminLTE|bootstrap|jquery.slimscroll.min).js$/),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors' + (isProduction ? '.min' : '.') + '.js')
];
if (isProduction) plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));


module.exports = {
    entry: {
        app: ['whatwg-fetch', path.resolve(__dirname, 'client/src/index.jsx')],
        vendors: ['react', 'react-router', 'flux', 'react-dom', 'jquery', 'moment', 'qs']
    },
    output: {
        path: DISTDIR,
        filename: '[name]' + (isProduction ? '.min' : '.') + '.js'
        //, publicPath: '/assets/'
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|js)?$/,
                include: SOURCEDIR,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react', 'stage-3'],
                    compact: false
                }
            },
            {test: /\.json$/, include: SOURCEDIR, exclude: /node_modules/, loader: 'json'},
            {test: /\.(less|css)$/, include: SOURCEDIR, exclude: /node_modules/, loaders: ['style', 'css', 'less']},
            // {
            //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     include: SOURCEDIR, exclude: /node_modules/,
            //     loader: "url-loader?limit=10000&minetype=application/font-woff"
            // },
            // {
            //     test: /\.(woff|woff2|eot|ttf|svg)$/,
            //     loader: 'file-loader?name="[name]-[hash].[ext]"'
            // },
            {
                test: /\.(ttf|eot|svg|woff|woff2)?(\?\S*)?$/,
                include: SOURCEDIR,
                exclude: /node_modules/,
                loader: "file"
            },
            // {
            //     test: /\.(jpg|png|jpeg)$/,
            //     include: SOURCEDIR,
            //     exclude: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'client/src/publics/plugins')],
            //     loader: "url?limit=8192"
            // },
            {
                test: /\.(jpg|jpeg|png|gif)$/,
                include: SOURCEDIR,
                exclude: /node_modules/,
                loader: 'file'
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            toastr: path.resolve(__dirname, 'client/src/publics/plugins/toastr/toastr.min.js'),
            icheck: path.resolve(__dirname, 'client/src/publics/plugins/iCheck/icheck.js'),
            datetimepicker: path.resolve(__dirname, 'client/src/publics/plugins/datetimepicker/js/bootstrap-datetimepicker.min.js'),
            select2: path.resolve(__dirname, 'client/src/publics/plugins/select2/select2.full.js'),
            'jquery.fileupload': path.resolve(__dirname, 'client/src/publics/plugins/jqueryFileUpload/jquery.fileupload.js'),
            'jquery.iframe-transport': path.resolve(__dirname, 'client/src/publics/plugins/jqueryFileUpload/jquery.iframe-transport.js'),
            'jquery.ui.widget': path.resolve(__dirname, 'client/src/publics/plugins/jqueryFileUpload/jquery.ui.widget.js')
        }
    }
};