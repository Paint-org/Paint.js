
# Build Extensions
tsc -m commonjs -t ES5 ../../Paint.js-core-extensions/extensions/**/*.ts

# Build Paint.js
tsc -m commonjs -t ES5 index.ts classes/*.ts -out index.js

# Start Paint.js
nw/nw .
