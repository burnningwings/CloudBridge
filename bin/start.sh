#!/bin/bash

current_dir=`dirname "$0"`

# ssh到mu01进行端口转发，日志不输出到文件
nohup ssh mu01 portforward :9992 cu03:9992 >/dev/null 2>&1 &

echo "start to listen on mc.ccnl.scut.edu.cn:9992"
