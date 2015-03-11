/// <reference path="../libs/node/node.d.ts" />

module Paint {
    export class ExtensionManager {

        private paint: Paint.Global;
        private extensionsPath: string;

        constructor(paint: Paint.Global) {
            this.paint = paint;
            var path: string = window.location.pathname.split('index.html')[0];

            /* pathname in Windows is '/C:/', so initial '/' mush be removed */
//            this.extensionsPath = ((process.platform === "win32") ? path.substring(1) : path)
//                + '../../Paint.js-core-extensions/extensions/';
        }

        addSingleExtension(mainDirectory) {

            var paint = this.paint;
            var ext = require(mainDirectory);
            
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
            var paint = this.paint,
                $ = paint.$;

            for (var extension in PaintExtensions) {
            	var ist = new PaintExtensions[extension](paint)
            	paint.registerExtension(ist);
            	ist.init();
            }
            
            callback();
            
//            fs.readdir(this.extensionsPath, $.proxy(function (error, list) {
//                if (error) {
//                    console.error('Error while opening extension folder');
//                    console.log(error);
//                    return;
//                }
//
//                for (var extFolder in list) {
//                    if (list.hasOwnProperty(extFolder)) {
//                        this.addSingleExtension(this.extensionsPath + list[extFolder]);
//                    }
//                }
//
//                if (callback !== null) callback();
//            }, this));
        }
    }
}