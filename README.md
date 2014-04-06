Paint.JS
========

Setup development environment
-----------------------------
 1. Install node.js for your platform (install npm too, if asked).
 2. Install the [TypeScript compiler](https://www.npmjs.org/package/typescript): run `npm install -g typescript` with admin privileges.
 3. Download and extract [node-webkit](https://github.com/rogerwang/node-webkit) for your platform.
 4. If you want code completion, syntax highlighting and a lot more nice features, [set up Eclipse](https://github.com/Antaniasdasd/Paint.js/wiki/Setting-Up-IDE).

Compile (for development)
-------------------------
    tsc --sourcemap --module commonjs -t ES5 index.ts

(tip: add the `-w` parameter to automatically recompile files whenever they get saved)

Run
---
Execute node-webkit passing the src folder of Paint.js as the first parameter:

    path-to-node-webkit/nw path-to-paint-js/src
