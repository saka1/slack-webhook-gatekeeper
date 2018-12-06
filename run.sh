#!/usr/bin/env bash

set -eu

if [ $# -le 1 ]; then
    echo 'this script requires two arguments' 1>&2
    exit 1
fi

target_dir=$1

if [ ! -d $target_dir ]; then
    echo 'target dir not found' 1>&2
    exit 1
fi

cd ./$target_dir
yarn run $2
