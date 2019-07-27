# slack-webhook-gatekeeper

Create your receiver on AWS to proxy webhook from Slack.

## Usage

```sh
yarn install
cd webhook-proxy && yarn install && cd ../

# set environment variables used in webhook-proxy/serverless.yml

# deploy
./serverless.sh webhook-proxy deploy -v
```

## Example config

This is a example to register a service `hoge`:

```sh
aws ssm put-parameter --name $BACKEND_SERVICE_PARAMETER_STORE_ROOT/hoge --type String --value 1
aws ssm put-parameter --name $BACKEND_SERVICE_PARAMETER_STORE_ROOT/hoge/url --type String --value example.com # upstream address
aws ssm put-parameter --name $BACKEND_SERVICE_PARAMETER_STORE_ROOT/hoge/signingSecret --type String --value <slack's signing secret>
```

Then, we can use `https://<api-gateway-host>/slack/webhooks/hoge` as Webhook endpoint.

