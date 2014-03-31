import glob = require('./Global');

export class Extension {
    static EXTENSION_NAME : string = "";
    
    paint : glob.Paint;
    private static htmlIdCount = 0;
    
    constructor(paint:glob.Paint) {
        this.paint = paint;
    }
    
    init() {
    
    }
    
    /**
     * Return a unique ID string to apply to dynamically generated HTML elements.
     */
    public static getUniqueHtmlId() : string {
        var count = this.htmlIdCount++;
        return 'uniq-dynamic-ext-id-' + count;
    }
    
    /**
     * Adds a custom indicator in the status bar.
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
    
    /*
        addToolbarIcon()
        addIndicator()
        addMenuItem()
        ...
    */

}