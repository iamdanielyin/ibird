/**
 * webpack开发配置文件
 */

'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const SOURCE_DIR = path.resolve(__dirname, 'client/src');
const DIST_DIR = path.resolve(__dirname, 'client/dist');

module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'client/src/index.jsx'), 'whatwg-fetch'],
        vendors: require('./webpack.vendors')
    },
    output: {
        path: DIST_DIR,
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|js)?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    compact: false
                }
            },
            {test: /\.less$/, include: SOURCE_DIR, loader: 'style!css!less'},
            {test: /\.css$/, include: SOURCE_DIR, loader: "style!css"},
            {test: /\.(jpg|png|jpeg)/, include: SOURCE_DIR, loader: "url?limit=8192"},
            {test: /\.json$/, loader: 'json'},
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'file'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hello ibird!'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.min.js'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};