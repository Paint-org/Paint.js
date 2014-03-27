import glob = require('../../Global');
import tool = require('./Tool');
import color = require('../../Color');

export class ColorChooser extends tool.Tool 
{
    static TOOL_NAME : string = "ColorChooser";
    paint : glob.Paint;
    
    inputPrimaryColor : HTMLInputElement;
    inputSecondaryColor : HTMLInputElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = this.paint.$;
    
        // add input color
        $("#topBar").append('<div>\
                Primary color: <input type="color" id="toolColor1" value="#000000" />\
                Secondary color: <input type="color" id="toolColor2" value="#ffffff" />\
           </div>');
        
        this.inputPrimaryColor = <HTMLInputElement> $("#toolColor1")[0];
        this.inputSecondaryColor = <HTMLInputElement> $("#toolColor2")[0];
        
        // set event handlers
        $(this.inputPrimaryColor).on("change", $.proxy(this.setPrimaryColor, this)).change();
        $(this.inputPrimaryColor).on("change", $.proxy(this.setSecondaryColor, this)).change();
    }
    
    /**
     * Primary color changed, update on paint object
     */
    private setPrimaryColor(ev) {
        this.paint.primaryColor = new color.Color(this.paint.$(this.inputPrimaryColor).val());
    }
    
    /**
     * Secondary color changed, update on paint object
     */
    private setSecondaryColor(ev) {
        this.paint.secondaryColor = new color.Color(this.paint.$(this.inputSecondaryColor).val());        
    }
}