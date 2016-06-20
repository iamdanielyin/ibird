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
        title: 'Hello ibird!'
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),
    new webpack.IgnorePlugin(/(AdminLTE|bootstrap).js$/),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors' + (isProduction ? '.min' : '.') + '.js')
];
if (isProduction) plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));


module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'client/src/index.jsx'), 'whatwg-fetch'],
        vendors: ['react', 'react-router', 'flux', 'react-dom', 'jquery']
    },
    output: {
        path: DISTDIR,
        filename: '[name]' + (isProduction ? '.min' : '.') + '.js'
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|js)?$/,
                include: SOURCEDIR,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react'],
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
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg|gif)$/,
                include: SOURCEDIR,
                exclude: /node_modules/,
                loader: 'file'
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};