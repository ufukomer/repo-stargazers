var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var config = {
  target: 'node',

  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  },

  entry: [
    './src/server/index.js'
  ],

  output: {
    path: path.resolve('./build/public'),
    filename: '../server.js',
    publicPath: '/public/',
    libraryTarget: 'commonjs2'
  },

  module: {
    noParse: [
      /node_modules\/couchbase\//
    ],
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
        test: /\.json$/,
        loader: 'json-loader'
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

  plugins: [],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },

  externals: {
    'jsdom': 'window',
    'cheerio': 'window'
  }
};

var env = process.env.NODE_ENV;
if (env === 'development' || env === 'production') {
  config.externals = nodeModules;
}

module.exports = config;
