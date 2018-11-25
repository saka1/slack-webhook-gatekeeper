# webhook-gatekeeper

Create receiver on AWS to receive webhook from Slack.

## Usage

```sh
yarn install
cd webhook-proxy && yarn install && cd ../

# set environment variables written in webhook-proxy/serverless.yml

# deploy
./serverless.sh deploy -v
```
