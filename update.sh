#!/bin/bash

current_dir=`dirname "$0"`

cd $current_dir

if [ ! -n "$1" ] ;then
    echo "请输入分支名称作为参数,如master."
    exit 0
fi

git checkout $1 &&  git checkout . && git clean -xdf

git pull origin $1

mvn clean && mvn package

deploy_dir=$current_dir/../deploy

if [ ! -d $deploy_dir ];
then
    mkdir -p $deploy_dir;
fi

cp target/CloudBridge-1.0-SNAPSHOT.jar $deploy_dir

chmod u+x bin/start.sh && chmod u+x bin/stop.sh
