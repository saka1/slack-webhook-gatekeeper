const slack = require('@slack/events-api');

// wrapper of slack.verifyRequestSignature
module.exports.verifyRequestSignature = ({
  signingSecret, requestSignature, requestTimestamp, body,
}) => {
  try {
    if (slack.verifyRequestSignature({
      signingSecret, requestSignature, requestTimestamp, body,
    })) {
      return { verifyResult: true };
    }
  } catch (error) {
    return { verifyResult: false, error };
  }
  throw new Error('must not happen');
};
