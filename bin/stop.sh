#!/bin/bash

hostname=`hostname`

CURRENT_PID=`lsof -i:9992 | grep -v 'COMMAND' | awk '{print $2}'`
if [[ $CURRENT_PID != '' ]];then
    kill -9 $CURRENT_PID
    echo "kill CloudBridge in $hostname done."
fi

PID=`ssh mu01 lsof -i:9992 | grep -v 'COMMAND' | awk '{print $2}'`
if [[ $PID != '' ]];then
    ssh mu01 kill -9 $PID
    echo "kill CloudBridge with PID: $PID in mu01 done."
fi
