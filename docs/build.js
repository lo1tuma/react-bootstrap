/* eslint no-var: 0 */
'use strict';

require('babel/register');

var fs = require('fs');
var path = require('path');
var Root = require('./src/Root');

Root.getPages()
  .forEach(function (fileName) {
    var RootHTML = Root.renderToString({initialPath: fileName});

    fs.writeFileSync(path.join(__dirname, '../docs-built', fileName), RootHTML);
  });
