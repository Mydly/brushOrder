/**
 * Created by Administrator on 2017/4/12.
 */
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
var APP_PATH = path.resolve(__dirname, 'app');
var SRC_PATH = path.resolve(__dirname, 'src');

module.exports = {
    target: 'electron',
    node: {
        fs: 'empty'
    },
    entry:{
        js:'./src/entry.js'
    },
    output:{
        filename:'./app/entry.js',
        //chunkFilename:'./app/[chunkhash].js'
    },
    module:{
        loaders:[
            {
                loader: 'babel-loader',
                include: [
                    SRC_PATH,
                ],
                // Only run `.js` and `.jsx` files through Babel
                test: /\.js|\.jsx?$/,
                // Options to configure babel with
                query: {
                    presets: ['es2015', 'react'],
                    "plugins": [
                        ["import", { libraryName: "antd", style: "css" }] // `style: true` 会加载 less 文件
                      ]
                }
            },
            {
                test: /\.png|\.jpg$/,
                loader:'url-loader'
            },
            //scss
            {
                test: /\.scss|\.sass$/,
                loaders:['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }

        ]
    },
    plugins:[
        //new ExtractTextPlugin("[name].css", {  allChunks: true }),
        //new webpack.optimize.CommonsChunkPlugin("chunks"),
        //new webpack.optimize.DedupePlugin(),
        //new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            { from: path.resolve(SRC_PATH, 'main.js'), to: path.resolve(APP_PATH,'main.js') },
            { from: path.resolve(SRC_PATH, 'icon.icns'), to: path.resolve(APP_PATH,'icon.icns') },
            { from: path.resolve(SRC_PATH, 'icon.ico'), to: path.resolve(APP_PATH,'icon.ico') },
            { from: path.resolve(SRC_PATH, 'index.html'), to: path.resolve(APP_PATH,'index.html') },
            { from: path.resolve(SRC_PATH, '../package.json'), to: path.resolve(APP_PATH,'package.json') },
            { from: path.resolve(SRC_PATH, 'config'), to: path.resolve(APP_PATH,'config') },
            { from: path.resolve(SRC_PATH, 'function'), to: path.resolve(APP_PATH,'function')}
        ])
    ]
}