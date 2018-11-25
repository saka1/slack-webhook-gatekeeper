const { promisify } = require('util');
const request = require('request');

module.exports.proxyClient = async url => promisify(request.get)(url);
