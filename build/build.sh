#!/bin/bash

# We move into src directory, regardless of the path from which we called this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
cd ../src

if [ ! -f ../build/config/build.config ]
then
    echo Missing build configuration.
	echo Copy "config/build.config.example" to "config/build.config" and edit it to apply your settings.
	exit
fi

source ../build/config/build.config

echo "Building Paint.js..."
tsc -m commonjs -t ES5 index.ts classes/*.ts --sourcemap --declaration --out index.js

echo "Merging the declaration files for the extensions..."
mkdir -p $EXTENSIONS_PROJECT_PATH/common-headers/
cat libs/node/node.d.ts \
	libs/jquery/jquery.d.ts \
	libs/jqueryui/jqueryui.d.ts \
	index.d.ts \
	> $EXTENSIONS_PROJECT_PATH/common-headers/paintjs.d.ts
rm index.d.ts

echo "Building extensions..."
tsc -m commonjs -t ES5 $EXTENSIONS_PROJECT_PATH/extensions/**/*.ts --sourcemap

echo "Done."