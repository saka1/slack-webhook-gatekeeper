

const { verifyRequestSignature } = require('./verify');
const { proxyClient } = require('./proxyclient');
const BackendResolver = require('./resolvebackend');
const WebhookProxy = require('./webhookproxy');

// dependencies of BackendResolver
const AWS = require('aws-sdk');
const ssm = new AWS.SSM({ region: 'ap-northeast-1' }); // TODO use constant
const resolver = new BackendResolver(ssm, process.env.BACKEND_SERVICE_PARAMETER_STORE_ROOT);

// dependencies of WebhookProxy
const webhookProxy = new WebhookProxy(resolver, verifyRequestSignature, proxyClient);

module.exports.handler = async (event, context, callback) => {
  return webhookProxy.handler(event, context, callback);
};
