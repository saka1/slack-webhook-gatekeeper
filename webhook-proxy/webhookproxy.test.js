const WebhookProxy = require("./webhookproxy");

class MockResolver {
  constructor() {
    this.param = null;
  }

  // eslint-disable-next-line class-methods-use-this
  async resolve(_id) {
    return this.param;
  }

  setParam(param) {
    this.param = param;
  }
}

const mockResolver = new MockResolver();
const verifyRequestSignature = () => ({ verifyResult: true });
const proxyClient = async () => ({ statusCode: 200, backendReponseBody: "proxyBody" });
const webhookProxy = new WebhookProxy(mockResolver, verifyRequestSignature, proxyClient);

test("backendServiceId is empty", async () => {
  const req = { pathParameters: {} };
  await webhookProxy.handler(req, null, (err, data) => {
    expect(data.statusCode).toEqual(404);
  });
});

test("unknown service", async () => {
  const req = {
    pathParameters: {
      backendServiceId: "xxx",
    },
  };
  mockResolver.setParam({ found: false });
  await webhookProxy.handler(req, null, (err, data) => {
    expect(data.statusCode).toEqual(404);
  });
});

test("missing header", async () => {
  const req = {
    pathParameters: {
      backendServiceId: "xxx",
    },
    headers: {},
  };
  mockResolver.setParam({
    found: true,
    backendService: { url: "example.com", slackSginingSecret: "aaabbb" },
  });
  await webhookProxy.handler(req, null, (err, data) => {
    expect(data.statusCode).toEqual(404);
  });
});

describe("well-formed request", () => {
  const req = {
    pathParameters: {
      backendServiceId: "xxx",
    },
    headers: { "X-Slack-Signature": "a", "X-Slack-Request-Timestamp": 123 },
  };

  beforeEach(() => {
    mockResolver.setParam({
      found: true,
      backendService: { url: "example.com", slackSginingSecret: "aaabbb" },
    });
  });

  test("valid request", async () => {
    await webhookProxy.handler(req, null, (err, data) => {
      expect(data.statusCode).toEqual(200);
      expect(data.body).toEqual("proxyBody");
    });
  });

  test("resolved successfully but verify failed", async () => {
    const verifyFailed = () => ({ verifyResult: false });
    const proxy = new WebhookProxy(mockResolver, verifyFailed, proxyClient);
    await proxy.handler(req, null, (err, data) => {
      expect(data.statusCode).toEqual(404);
    });
  });
});
