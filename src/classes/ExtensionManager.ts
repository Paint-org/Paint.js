/// <reference path="../libs/node/node.d.ts" />

var fs = require('fs');

module Paint {
    export class ExtensionManager {

        private paint: Paint.Global;

        constructor(paint: Paint.Global) {
            this.paint = paint;
        }

        addSingleExtension(mainDirectory) {

            var paint = this.paint,
                ext = require(mainDirectory);
            console.log(ext);
            if (ext.Extensions && ext.Extensions.forEach) {
                ext.Extensions.forEach(function (ext) {
                    var ist = new ext(paint);
                    paint.registerExtension(ist);
                    ist.init();
                });
            } else {
                console.warn("Extension " + mainDirectory + " not loaded: no valid exports found.");
            }
        }

        addExtensions(callback: () => void) {

            var app_path = process.execPath.split('nw')[0];

            var extPath = window.location.pathname.substring(1).split('index.html')[0]
                + 'extensions/',
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

                if (callback !== null) callback();
            }, this));
        }
    }
}