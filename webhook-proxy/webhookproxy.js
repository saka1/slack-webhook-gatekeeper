const notFoundResponse = {
  statusCode: 404,
  body: "",
};

module.exports = class WebhookProxy {
  constructor(backendResolver, verifyRequestSignature, proxyClient) {
    this.backendResolver = backendResolver;
    this.verifyRequestSignature = verifyRequestSignature;
    this.proxyClient = proxyClient;
  }

  async handler(event, _context, callback) {
    // special case: handle 'ping' message from internal invocation
    if ("type" in event && event.type === "ping") {
      console.log("ping received");
      return callback(null, { type: "pong" });
    }
    // resolve backend phase
    if (!(event.pathParameters && "backendServiceId" in event.pathParameters)) {
      console.log("backendServiceId not found");
      return callback(null, notFoundResponse);
    }
    const { backendServiceId } = event.pathParameters;
    const { found, backendService } = await this.backendResolver.resolve(backendServiceId);
    if (!found) {
      console.log(`unknown backendService: ${backendServiceId}`);
      return callback(null, notFoundResponse);
    }
    // verify phase
    if (!("X-Slack-Signature" in event.headers && "X-Slack-Request-Timestamp" in event.headers)) {
      console.log("missing header: X-Slack-Signature or X-Slack-Request-Timestamp");
      return callback(null, notFoundResponse);
    }
    const signingSecret = backendService.slackSginingSecret;
    const requestSignature = event.headers["X-Slack-Signature"];
    const requestTimestamp = parseInt(event.headers["X-Slack-Request-Timestamp"], 10);
    const { body } = event;
    const { verifyResult, error } = this.verifyRequestSignature({
      signingSecret,
      requestSignature,
      requestTimestamp,
      body,
    });
    if (!verifyResult) {
      console.log("verify failed");
      console.log(error);
      return callback(null, notFoundResponse);
    }
    console.log("verify successed");
    // proxy phase
    const { statusCode, backendReponseBody } = await this.proxyClient(backendService.url);
    return callback(null, {
      statusCode,
      body: backendReponseBody,
    });
  }
};
