'use strict';

var express = require('express');

var development = process.env.NODE_ENV !== 'production';
var app = express();
var path = require('path');

if (development) {
  require('babel/register');
  var path = require('path');
  var url = require('url');
  var webpack = require('webpack');
  var webpackMiddleware = require('webpack-dev-middleware');
  var webpackConfig = require('../webpack/webpack.config')({
    development: development,
    docs: true
  });
  var publicPath = webpackConfig.output.publicPath;

  webpackConfig.output.path = '/';
  webpackConfig.output.publicPath = undefined;

  var Root = require('./src/Root');

  app = app
    .use(webpackMiddleware(webpack(webpackConfig), {
      noInfo: false,
      publicPath: publicPath,
      stats: {
          colors: true
      }
    }))
    .use(function renderApp(req, res) {
      var fileName = url.parse(req.url).pathname;
      var RootHTML = Root.renderToString({initialPath: fileName});

      res.send(RootHTML);
    });
} else {
  app = app
    .use(express.static(path.join(__dirname, '../docs-built')));
}

app
  .listen(4000, function () {
    console.log('Server started at http://localhost:4000');
  });
