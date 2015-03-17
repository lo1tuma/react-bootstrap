require('babel/register');
var config = require('./webpack/docs.config');

console.log(JSON.stringify(config));

module.exports = config;
