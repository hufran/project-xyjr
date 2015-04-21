#!/usr/bin/env bash

set -e

node -e 'console.log(process)'
if [ -z `which show-node-config` ]; then
    npm i -g show-node-config
fi
show-node-config

if [ -z `which ccnpm` ]; then
    npm i -g ccnpm
fi

git fetch origin
git checkout $GIT_DEPLOY_HEAD
if [ -f npm-shrinkwrap.json ]; then
    #如果存在此文件，表示已上生产环境（否则上线过程有问题），不再随便动依赖包
    GIT_DIFF_RESULT=`git diff $GIT_DEPLOY_HEAD $GIT_PREVIOUS_HEAD -- npm-shrinkwrap.json`
    if [ -n $GIT_DIFF_RESULT ]; then
        ccnpm install
    fi
else
    #如果 npm-shrinkwrap.json 文件不存在，则每次都更新依赖到最新版本
    ccnpm update
fi
ccnpm run test # 测试（如果有的话）通过才可以继续
ccnpm run build
ccnpm run reload
