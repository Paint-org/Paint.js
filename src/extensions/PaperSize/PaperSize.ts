import glob = require('../../classes/Global');

class PaperSize {
    public EXTENSION_NAME: string = "com.paintjs.PaperSize";
    paint: glob.Paint;
    private indicator: HTMLElement;

    public constructor(paint: glob.Paint) {
        this.paint = paint;

    }

    init() {
        this.indicator = this.paint.barManager.addTextIndicatorItem("extensions/PaperSize/icon.png", 0, false);
        this.onResize();
    }

    onResize() {
        var $ = this.paint.$;
        var baseCanvas = this.paint.currentPaper.baseLayer.canvas;

        $(this.indicator).html(baseCanvas.width + " &times; " + baseCanvas.height + "px");
    }
}

exports.Extensions = new Array();
exports.Extensions.push(PaperSize);