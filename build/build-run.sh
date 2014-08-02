#!/bin/bash

# We move into build directory, regardless of the path from which we called this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Build Paint.js
./build.sh

# Start Paint.js
./run.sh