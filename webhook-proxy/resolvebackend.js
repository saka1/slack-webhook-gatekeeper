const { promisify } = require("util");
const memoize = require("lodash.memoize");

module.exports = class BackendResolver {
  constructor(ssm, parameterStoreRootPath) {
    this.ssm = ssm;
    this.parameterStoreRootPath = parameterStoreRootPath;
    this.getParametersPromise = promisify(this.ssm.getParametersByPath).bind(this.ssm);
    this.services = null;
    this.doResolve = memoize(x => this.doResolve_(x));
  }

  async initialize_() {
    if (this.services) {
      return;
    }
    const names = (await this.getParametersPromise({
      Path: this.parameterStoreRootPath,
    })).Parameters.map(x => x.Name.split("/").pop());
    this.services = new Set(names);
  }

  async resolve(backendServiceId) {
    await this.initialize_();
    if (!this.services.has(backendServiceId)) {
      return { found: false };
    }
    return this.doResolve(backendServiceId);
  }

  async doResolve_(backendServiceId) {
    const root = this.parameterStoreRootPath;
    const parameters = (await this.getParametersPromise({
      Path: `${root}/${backendServiceId}`,
      Recursive: true,
    })).Parameters;
    const getAttribute = name =>
      parameters.find(x => x.Name === `${root}/${backendServiceId}/${name}`).Value;
    const backendService = {
      url: getAttribute("url"),
      slackSginingSecret: getAttribute("signingSecret"),
    };
    return { found: true, backendService };
  }
};
