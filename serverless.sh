#!/usr/bin/env bash

set -eu

# usage:
# serverless.sh webhook-proxy deploy -v
#

script_dir=$(cd $(dirname $0); pwd)
serverless="$script_dir/node_modules/.bin/serverless"

if [ $# -eq 0 ] ; then
    $serverless
    exit $?
fi

# Regard the first argument as target dir if exists.
if [ -d $script_dir/$1 ]; then
    cd $script_dir/$1
    shift
fi

$serverless $@

