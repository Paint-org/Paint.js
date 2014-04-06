import glob = require('../../classes/Global');
import extension = require('../../classes/Extension');

export class SizeChooser extends extension.Extension
{
    static EXTENSION_NAME : string = "com.paintjs.SizeChooser";
    paint : glob.Paint;
    
    inputNode : HTMLInputElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        super.init();
        
        var paint = this.paint;
        var $ = this.paint.$;
        
        $("#topBar").append('Size: 1 <input type="range" id="toolSize" value="3" min="1" max="20" /> 20');
        
        var inputNode = this.inputNode = <HTMLInputElement> $('#toolSize')[0];
        
        $(this.inputNode).on("change", function(ev){
            var size = parseInt(paint.$(inputNode).val());
            paint.toolSize = size; 
        }).change();        
    }
    
    onToolSizeChanged() {
        var size = this.paint.toolSize;
        
        this.paint.$(this.inputNode).val(size);
    }
}