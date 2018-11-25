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

target_dir=$1
shift

if [ ! -d $target_dir ]; then
    echo 'target dir not found' 1>&2
    exit 1
fi

cd ./$target_dir
$serverless $@
