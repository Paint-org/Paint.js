import glob = require('../../classes/Global');
import extension = require('../../classes/Extension');
import color = require('../../classes/Color');

export class ColorChooser extends extension.Extension 
{
    static EXTENSION_NAME : string = "ColorChooser";
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
        $(this.inputSecondaryColor).on("change", $.proxy(this.setSecondaryColor, this)).change();
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