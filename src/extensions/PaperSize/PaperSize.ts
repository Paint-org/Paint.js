import glob = require('../../classes/Global');
import extension = require('../../classes/Extension');

export class PaperSize extends extension.Extension
{
    static EXTENSION_NAME : string = "PaperSize";
    paint : glob.Paint;
    private indicator : HTMLElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        var $ = this.paint.$;
        
        this.indicator = this.addTextIndicatorItem(null, 0, false);
        
        $("#paperWrapper").on("resize", $.proxy(this.onResize, this));
        this.onResize(null);
    }
    
    private onResize(ev) {
        var $ = this.paint.$;
        var baseCanvas = this.paint.currentPaper.baseLayer.canvas;
        
        $(this.indicator).html(baseCanvas.width + " &times; " + baseCanvas.height + "px");
    }
}