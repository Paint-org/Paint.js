import glob = require('../Global');
import extension = require('./Extension');

export class Zoom extends extension.Extension
{
    static EXTENSION_NAME : string = "Zoom";
    paint : glob.Paint;
    
    inputNode : HTMLInputElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = this.paint.$;
        
        var indicator = $('<div />').append('<input type="range" id="ext-zoom" value="100" min="1" max="400" />');
        
        this.addCustomIndicatorItem(indicator[0], 0);
        
        this.inputNode = <HTMLInputElement> $('#ext-zoom')[0];
        
        $(this.inputNode).on("change", $.proxy(this.zoomChanged, this)).change();
    }
    
    private zoomChanged(ev) {
        var zoom = parseInt(this.paint.$(this.inputNode).val());
        this.paint.currentPaper.Zoom = zoom / 100;     
    }
}