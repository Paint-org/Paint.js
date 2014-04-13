import glob = require('../../classes/Global');
import color = require('../../classes/Color');

class ColorChooser 
{
    public EXTENSION_NAME : string = "com.paintjs.ColorChooser";
    paint : glob.Paint;
    
    private inputPrimaryColor : HTMLInputElement;
    private inputSecondaryColor : HTMLInputElement;
    
    public constructor(paint:glob.Paint) {
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = this.paint.$;
    
        // add input color
        $("#miscToolbar").append('<div>\
                Primary color: <input type="color" id="toolColor1" value="#000000" />\
                Secondary color: <input type="color" id="toolColor2" value="#ffffff" />\
           </div>');
        
        this.inputPrimaryColor = <HTMLInputElement> $("#toolColor1")[0];
        this.inputSecondaryColor = <HTMLInputElement> $("#toolColor2")[0];
        
        // set event handlers
        $(this.inputPrimaryColor).on("change", $.proxy(this.setPrimaryColor, this)).change();
        $(this.inputSecondaryColor).on("change", $.proxy(this.setSecondaryColor, this)).change();
    }
    
    onPrimaryColorChanged() {
        var $ = this.paint.$,
            newColor = this.paint.primaryColor;

        $("#toolColor1").val(newColor.HexString);
    }
    
    onSecondaryColorChanged() {
        var $ = this.paint.$,
            newColor = this.paint.secondaryColor;

        $("#toolColor2").val(newColor.HexString);
    }
    
    /**
     * Primary color changed, update on paint object
     */
    private setPrimaryColor(ev : JQueryInputEventObject) {
        this.paint.primaryColor = new color.Color(this.paint.$(this.inputPrimaryColor).val());
    }
    
    /**
     * Secondary color changed, update on paint object
     */
    private setSecondaryColor(ev : JQueryInputEventObject) {
        this.paint.secondaryColor = new color.Color(this.paint.$(this.inputSecondaryColor).val());        
    }
}

exports.Extensions = new Array();
exports.Extensions.push(ColorChooser);