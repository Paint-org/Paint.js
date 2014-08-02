#!/bin/bash

# We move into build directory, regardless of the path from which we called this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

if [ ! -f ./run.config ]
then
    echo Missing run configuration.
	echo Copy "run.config.example" to "run.config" and apply your settings.
	exit
fi

# Build Paint.js
./build.sh

source ./run.config

# Start Paint.js
echo "Starting..."
"$RUN_NW_BINARY" ../src
