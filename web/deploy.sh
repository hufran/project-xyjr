#!/usr/bin/env bash
# usage: ./deploy [git branch or hash]

cd "$( dirname "${BASH_SOURCE[0]}" )"
PWD=`pwd`
export BASENAME=`basename $PWD`
export GIT_PREVIOUS_HEAD=`git rev-parse HEAD`
export GIT_DEPLOY_HEAD=$1
export SLACK_TOKEN="xoxp-3479916423-4168204571-4191458970-ad4c55" # undozen's slack api token
echo "deploying on $(hostname), from $GIT_PREVIOUS_HEAD to $GIT_DEPLOY_HEAD"
if [ -f $HOME/.nvm/nvm.sh ]; then
    source $HOME/.nvm/nvm.sh
    nvm use iojs
else
    echo "~/.nvm/nvm.sh not found, run init.sh instead"
    exit 1
fi
./update.sh
if [ -z `which slack` ]; then
    npm i -g node-slack-cli
fi
if [ "$?" -eq "0" ]; then
    slack -c node-deploy -m "upgrade success! $BASENAME on $(hostname), $GIT_PREVIOUS_HEAD -> $GIT_DEPLOY_HEAD" -u jenkins
else
    slack -c node-alarm -m "upgrade failed! $BASENAME on $(hostname), $GIT_PREVIOUS_HEAD -> $GIT_DEPLOY_HEAD" -u jenkins
fi
