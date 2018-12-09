const AWS = require("aws-sdk");
const verifyRequestSignature = require("./verify");
const proxyClient = require("./proxyclient");
const BackendResolver = require("./resolvebackend");
const WebhookProxy = require("./webhookproxy");

// dependencies of BackendResolver
const ssm = new AWS.SSM({ region: process.env.AWS_REGION });
const resolver = new BackendResolver(ssm, process.env.BACKEND_SERVICE_PARAMETER_STORE_ROOT);

// dependencies of WebhookProxy
const webhookProxy = new WebhookProxy(resolver, verifyRequestSignature, proxyClient);

module.exports.handler = async (event, context, callback) =>
  webhookProxy.handler(event, context, callback);
