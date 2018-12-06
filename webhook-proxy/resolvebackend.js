const { promisify } = require("util");

module.exports = class BackendResolver {
  constructor(ssm, parameterStoreRootPath) {
    this.ssm = ssm;
    this.parameterStoreRootPath = parameterStoreRootPath;
  }

  async resolve(id) {
    const root = this.parameterStoreRootPath;
    const getParametersPromise = promisify(this.ssm.getParametersByPath).bind(this.ssm);
    const parameters = (await getParametersPromise({
      Path: `${root}/${id}`,
      Recursive: true,
    })).Parameters;
    const findParamValue = name => parameters.find(x => x.Name === `${root}/${id}/${name}`).Value;
    if (parameters.length === 0) {
      return { found: false };
    }
    const backendService = {
      url: findParamValue("url"),
      slackSginingSecret: findParamValue("signingSecret"),
    };
    return { found: true, backendService };
  }
};
