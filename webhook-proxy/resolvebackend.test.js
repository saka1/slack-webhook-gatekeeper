// A mock of AWS.SSM class.
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
class SSMMock {
  constructor() {
    this.params = [];
  }

  getParametersByPath(_params, callback) {
    callback(null, {
      Parameters: this.params,
    });
  }

  setParameter(params) {
    this.params = params;
  }
}
const ssm = new SSMMock();
const BackendResolver = require("./resolvebackend");
const backendResolver = new BackendResolver(ssm, "/root");

test("unknown service", async () => {
  const result = await backendResolver.resolve("foo");
  expect(result).toEqual({ found: false });
});

test("found service", async () => {
  ssm.setParameter([
    { Name: "/root/service-a/url", Value: "example.com" },
    { Name: "/root/service-a/signingSecret", Value: "secret-string" },
  ]);
  const result = await backendResolver.resolve("service-a");
  expect(result.found).toBe(true);
  expect(result.backendService).toEqual({
    url: "example.com",
    slackSginingSecret: "secret-string",
  });
});
