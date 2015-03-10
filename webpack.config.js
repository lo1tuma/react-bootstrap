require('babel/register');
var config = require('./webpack/webpack.config');

var result = config();

console.log(result);

module.exports = result;
