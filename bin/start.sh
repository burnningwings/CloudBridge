#!/bin/bash

current_dir=`dirname "$0"`
deploy_dir=$current_dir/../../deploy

cd $deploy_dir

# ssh到mu01进行端口转发，日志不输出到文件
nohup ssh mu01 portforward :9992 cu03:9992 >/dev/null 2>&1 &

echo "start to listen on mc.ccnl.scut.edu.cn:9992"

java -jar CloudBridge-1.0-SNAPSHOT.jar --spring.config.location=$deploy_dir/config/application-prod.properties -Dlog4j.configuration=$deploy_dir/config/log4j.properties

