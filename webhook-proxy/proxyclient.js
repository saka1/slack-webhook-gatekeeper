const { promisify } = require("util");
const request = require("request");

module.exports = async url => promisify(request.get)(url);
