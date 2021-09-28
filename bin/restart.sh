#!/bin/bash

current_dir=`dirname "$0"`

$current_dir/stop.sh && $current_dir/start.sh