#!/bin/bash

# We move into build directory, regardless of the path from which we called this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

if [ ! -f ./config/run.config ]
then
	echo Missing run configuration.
	echo Copy "config/run.config.example" to "config/run.config" and edit it to apply your settings.
	exit
fi

source ./config/run.config

# Start Paint.js
echo "Starting..."
"$RUN_NW_BINARY" ../src
