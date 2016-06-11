'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval',

  debug: 'true',

  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  },

  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/client/index.tsx'
  ],

  output: {
    path: path.resolve('./build/public'),
    publicPath: '/public/',
    filename: 'js/[name].js',
    pathinfo: true
  },

  module: {
    preLoaders: [
      {
        test: /\.tsx?$/,
        loader: 'tslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'react-hot!ts',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel?presets[]=es2015',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css?sourceMap'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file'
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      title: 'Repo Stargazers',
      template: `${__dirname}/../../src/client/index.tpl.html`,
      filename: 'index.html'
    })
  ]
};
