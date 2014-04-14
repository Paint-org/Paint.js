/// <reference path="../libs/node/node.d.ts" />

import glob = require('./Global');
var fs = require('fs');

export class ExtensionManager {

    private paint: glob.Paint;

    constructor(paint: glob.Paint) {
        this.paint = paint;
    }

    addSingleExtension(mainDirectory) {

        var paint = this.paint,
            ext = require(mainDirectory);

        if (ext.Extensions instanceof Array) {
            ext.Extensions.forEach(function (ext) {
                var ist = new ext(paint);
                paint.registerExtension(ist);
                ist.init();
            });

        } else {
            console.warn("Extension " + mainDirectory + " not loaded: no valid exports found.");
        }
    }

    addExtensions() {

        var extPath = __dirname + '/../extensions/',
            $ = this.paint.$;

        fs.readdir(extPath, $.proxy(function (error, list) {
            if (error) {
                console.error('Error while opening extension folder');
                console.log(error);
                return;
            }

            for (var extFolder in list) {
                if (list.hasOwnProperty(extFolder)) {
                    this.addSingleExtension(extPath + list[extFolder]);
                }
            }
        }, this));
    }
}