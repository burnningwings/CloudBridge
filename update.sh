#!/bin/bash

current_dir=`dirname "$0"`

cd $current_dir

git checkout .

git pull origin master

mvn clean && mvn package

deploy_dir=$current_dir/../deploy

if [ ! -d $deploy_dir ];
then
    mkdir -p $deploy_dir;
fi

cp target/CloudBridge-1.0-SNAPSHOT.jar $deploy_dir

chmod u+x bin/start.sh && chmod u+x bin/stop.sh
