import glob = require('../../Global');
import tool = require('./Tool');

export class SizeChooser extends tool.Tool 
{
    static TOOL_NAME : string = "SizeChooser";
    paint : glob.Paint;
    
    inputNode : HTMLInputElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = this.paint.$;
        
        $("#topBar").append('Size: 1 <input type="range" id="toolSize" value="3" min="1" max="20" /> 20');
        
        this.inputNode = <HTMLInputElement> $('#toolSize')[0];
        
        $(this.inputNode).on("change", $.proxy(this.sizeChanged, this)).change();
    }
    
    private sizeChanged(ev) {
        this.paint.toolSize = parseInt(this.paint.$(this.inputNode).val());        
    }
}