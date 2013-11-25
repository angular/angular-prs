#!/bin/bash

set -ex


cd `dirname $0`

PROJECT_DIR=`pwd`
BUILD_DIR=dist
MASTER_SHA=`git rev-parse --short master`

grunt build

git checkout gh-pages

rm -rf bower_components
rm -rf data
rm -rf scripts
rm -rf styles
rm -rf views

cp -r $PROJECT_DIR/$BUILD_DIR/* $PROJECT_DIR/

git add --all
git commit -m "updating gh-pages to $MASTER_SHA"
git push upstream gh-pages
git checkout -
