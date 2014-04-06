import glob = require('./Global');
import color = require('./Color');

export class Extension {
    /** The internal name of the extension. This is not the display name!
     * Note that this value should be unique! A good example is
     * com.yourfullname.extensionname
     */
    static EXTENSION_NAME : string = "";
    
    paint : glob.Paint;
    private static htmlIdCount = 0;
    
    constructor(paint:glob.Paint) {
        this.paint = paint;
    }
    
    init() {
    
    }
    
    /**
     * Gets called when user changes primary color.
     * \param color the new color
     */    
    onPrimaryColorChanged(color : color.Color) {
        
    }

    /**
     * Gets called when user changes secondary color.
     * \param color the new color
     */    
    onSecondaryColorChanged(color : color.Color) {
        
    }
    
    /**
     * Return a unique ID string to apply to dynamically generated HTML elements.
     */
    public static getUniqueHtmlId() : string {
        var count = this.htmlIdCount++;
        return 'uniq-dynamic-ext-id-' + count;
    }
    
    /**
     * Adds a custom indicator to the status bar.
     * \param item HTMLElement to add to the status bar
     * \param priority specifies the relative position in the statusbar. Currently not implemented. FIXME.
     * \param autoWidth specifies if the indicator space width will be auto sized to the content.
     */
    addCustomIndicatorItem(item:HTMLElement, priority:number, autoWidth:boolean) : void {
        var $ = this.paint.$;
        
        var indicator = $('<div class="bottomIndicator" />').append($("<span />").append(item));
        if(autoWidth) {
            indicator.css("width", "auto");
        }
        $("#bottomBar").append(indicator);
    }
    
    /**
     * Adds a text indicator to the status bar.
     * \param icon The icon of this indicator. Currently not implemented. FIXME.
     * \param priority specifies the relative position in the statusbar. Currently not implemented. FIXME.
     * \param autoWidth specifies if the indicator space width will be auto sized to the content.
     * \returns the element that contains the text
     */
    addTextIndicatorItem(icon, priority:number, autoWidth:boolean) : HTMLElement {
        var $ = this.paint.$;
        
        var textSpan = $("<span />")[0];
        this.addCustomIndicatorItem(textSpan, priority, autoWidth);
        
        return textSpan;
    }

}