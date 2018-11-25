
const { verifyRequestSignature } = require('./verify');

describe('the specific time', () => {
  let originalDateNow;
  beforeEach(() => {
    originalDateNow = Date.now;
    Date.now = () => 1531420619; // requestTimestamp + 1
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  // test case from: https://api.slack.com/docs/verifying-requests-from-slack
  test('success case', () => {
    const signingSecret = '8f742231b10e8888abcd99yyyzzz85a5';
    const requestSignature = 'v0=a2114d57b48eac39b9ad189dd8316235a7b4a8d21a10bd27519666489c69b503';
    const requestTimestamp = 1531420618;
    const body = 'token=xyzz0WbapA4vBCDEFasx0q6G&team_id=T1DC2JH3J&team_domain=testteamnow&channel_id=G8PSS9T3V&channel_name=foobar&user_id=U2CERLKJA&user_name=roadrunner&command=%2Fwebhook-collect&text=&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT1DC2JH3J%2F397700885554%2F96rGlfmibIGlgcZRskXaIFfN&trigger_id=398738663015.47445629121.803a0bc887a14d10d2c447fce8b6703c';
    expect(verifyRequestSignature({
      signingSecret, requestSignature, requestTimestamp, body,
    }).verifyResult).toBe(true);
  });
});

test('fail case', () => {
  expect(verifyRequestSignature({
    signingSecret: 'aaaa', requestSignature: 'bbb', requestTimestamp: 111, body: 'hoge',
  }).verifyResult).toBe(false);
});
