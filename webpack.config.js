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
        app: path.resolve(__dirname, 'client/src/index.jsx'),
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
            {test: /\.less$/, include: SOURCE_DIR, loader: 'style!css!less'},
            {test: /\.css$/, include: SOURCE_DIR, loader: "style!css"},
            {test: /\.(jpg|png|jpeg)/, include: SOURCE_DIR, loader: "url?limit=8192"}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hello ibird!',
            hash: true
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};