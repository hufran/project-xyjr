#!/usr/bin/env bash
curl -o- http://gitlab.creditcloud.com/devops/nvm/raw/master/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 4
nvm alias default `nvm version`
npm i --registry=https://registry.npm.taobao.org -g ccnpm
ccnpm i
