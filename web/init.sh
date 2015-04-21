#!/usr/bin/env bash
# bash script for first time deploy
# usage: ./init

set -e
cd "$( dirname "${BASH_SOURCE[0]}" )"
PWD=`pwd`
export BASENAME=`basename $PWD`
source $HOME/.nvm/nvm.sh
nvm use iojs
if [ -z `which ccnpm` ]; then
    npm i -g ccnpm
fi
if [ -z `which pm2` ]; then
    npm i -g pm2
fi
if [ -z `which show-node-config` ]; then
    npm i -g show-node-config
fi
if [ -z `which slack` ]; then
    npm i -g node-slack-cli
fi
export GIT_HEAD=`git rev-parse HEAD`
git checkout $GIT_HEAD
ccnpm run build
ccnpm start
export SLACK_TOKEN="xoxp-3479916423-4168204571-4191458970-ad4c55" # undozen's slack api token
slack -c node-deploy -m "first time deploy success! $BASENAME on $(hostname), version $GIT_HEAD" -u jenkins
