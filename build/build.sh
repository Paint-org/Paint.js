#!/bin/bash

# We move into src directory, regardless of the path from which we called this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
cd ../src

if [ ! -f ../build/build.config ]
then
    echo Missing build configuration.
	echo Copy "build.config.example" to "build.config" and apply your settings.
	exit
fi

source ../build/build.config

echo "Building Paint.js..."
tsc -m commonjs -t ES5 index.ts classes/*.ts --declaration --out index.js

echo "Merging the declaration files for the extensions..."
mkdir -p $EXTENSIONS_PROJECT_PATH/common-headers/
cat libs/node/node.d.ts \
	libs/jquery/jquery.d.ts \
	libs/jqueryui/jqueryui.d.ts \
	index.d.ts \
	> $EXTENSIONS_PROJECT_PATH/common-headers/paintjs.d.ts
rm index.d.ts

echo "Building extensions..."
tsc -m commonjs -t ES5 $EXTENSIONS_PROJECT_PATH/extensions/**/*.ts

echo "Done."