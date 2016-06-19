/**
 * webpack开发配置文件
 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SOURCE_DIR = path.resolve(__dirname, 'client/src');
const DIST_DIR = path.resolve(__dirname, 'client/build');

module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'client/src/index.jsx'), 'whatwg-fetch'],
        vendors: require('./webpack.vendors')
    },
    output: {
        path: DIST_DIR,
        filename: '[name].js'
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
            {test: /\.less$/, include: SOURCE_DIR, exclude: /node_modules/, loader: 'style!css!less'},
            {test: /\.css$/, include: SOURCE_DIR, exclude: /node_modules/, loader: "style!css"},
            {test: /\.(jpg|png|jpeg)$/, include: SOURCE_DIR, exclude: /node_modules/, loader: "url?limit=8192"},
            {test: /\.json$/, include: SOURCE_DIR, exclude: /node_modules/, loader: 'json'},
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, include: SOURCE_DIR, exclude: /node_modules/, loader: 'file'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hello ibird!',
            hash: true
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};