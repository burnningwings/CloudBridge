#!/bin/bash

CURRENT_PID=`lsof -i:9992 | grep -v 'COMMAND' | awk '{print $2}'`
if [[ $CURRENT_PID != '' ]];then
    kill -HUP $CURRENT_PID
    echo "Reload CloudBridge in $hostname done."
fi
