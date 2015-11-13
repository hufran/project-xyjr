#!/bin/bash

set -e

dev=./dev
source=./source
output=./dist
index=$output/index.html


(cd $dev && npm run init)
PATH="$dev/node_modules/.bin:$PATH"


rm -rf $output
cp -r $source $output




perl -i -ne "/x-dev/ or print" $index


cat $index \
    | grep '<script' \
    | grep 'x-pick-lib' \
    | sed 's|src="||g' \
    | sed 's|"><\/| |g' \
    | awk '{print $3}' \
    | sed "s|^|$output/|" \
    | xargs cat > "$output/libs/package.min.js"

perl -i -ne "/x-pick-lib/ or print" $index



main_script=$(cat $index \
    | grep '<script' \
    | grep 'x-pick-main' \
    | sed 's|data-src="||g' \
    | sed 's|"><\/| |g' \
    | awk '{print $4}' \
    | sed "s|^|$output/|")


echo $main_script | xargs coffee -c
echo $main_script | sed 's|\.coffee|\.js|g' | xargs uglifyjs -c warnings=false -m --wrap -o "$output/scripts/main.min.js"

perl -i -ne "/x-pick-main/ or print" $index



perl -pi -e "s|<script data-src|<script src|g" $index



lessc --clean-css="--skip-advanced" $output/styles/main.less $output/styles/main.css


perl -pi -e "s|stylesheet/less|stylesheet|g" $index
perl -pi -e "s|main.less|main.css|g" $index
perl -pi -e "s|<base href=\"/\">|<base href=\"/h5/\">|g" $index
perl -pi -e "s|t={time}|t=`date +%s`000|g" $index


(cd $output; [ -d h5 ] || ln -sf . h5)


echo $'\360\237\215\273' '<3 BUILD SUCCESS'

