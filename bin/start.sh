#!/bin/bash

current_dir=`dirname "$0"`
deploy_dir=$current_dir/../../deploy

cd $deploy_dir

# ssh到mu01进行端口转发，日志不输出到文件
nohup ssh mu01 portforward :9992 cu03:9992 >/dev/null 2>&1 &

#nohup java -jar CloudBridge-1.0-SNAPSHOT.jar --spring.config.location=classpath:config/application-prod.properties -Dlog4j.configuration=config/log4j.properties --spring.profiles.active=prod >/dev/null 2>&1 &

nohup java -jar CloudBridge-1.0-SNAPSHOT.jar --spring.config.location=classpath:config/application-prod.properties -Dlog4j.configuration=config/log4j.properties --spring.profiles.active=prod >/data/home/hadoop/project/CloudBridge/deploy/logs/debug.log 2>/data/home/hadoop/project/CloudBridge/deploy/logs/debug_e.log &

echo "start to listen on mc.ccnl.scut.edu.cn:9992"

