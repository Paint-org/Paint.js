import glob = require('../../classes/Global');
import extension = require('../../classes/Extension');

export class Zoom extends extension.Extension
{
    static EXTENSION_NAME : string = "Zoom";
    paint : glob.Paint;
    
    inputNode : HTMLInputElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        var paint = this.paint;
        var $ = this.paint.$;
        
        // FIXME Spostare gli stili in CSS esterni. Bisogna prima decidere che struttura dare alle estensioni.
        var indicator = $('<div />').append('\
            <span id="ext-zoom-val" style="width: 40px; display: inline-block;"></span>\
            <input type="range" id="ext-zoom" value="100" min="10" max="400" step="10" style="vertical-align: middle;" />\
        ');
        
        this.addCustomIndicatorItem(indicator[0], 0, true);
        
        this.inputNode = <HTMLInputElement> $('#ext-zoom')[0];
        
        $(this.inputNode).on("change", $.proxy(this.zoomChanged, this)).change();
    }
    
    private zoomChanged(ev) {
        var $ = this.paint.$;
        var zoom = parseInt($(this.inputNode).val());
        this.paint.currentPaper.Zoom = zoom / 100;
        $('#ext-zoom-val').text(zoom + "%");
    }
}