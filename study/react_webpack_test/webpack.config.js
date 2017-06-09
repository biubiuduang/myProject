var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath : "temp/"
    },
    devServer: {
        contentBase: './',
        host: '127.0.0.1',
        port:'8080',
        watchContentBase : true
    },
    module : {
        loaders :[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: "babel-loader",
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test:/\.css/,
                loader:"style-loader!css-loader"
            }
        ]
    }
};