import glob = require('../Global');

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
     */
    addCustomIndicatorItem(item:HTMLElement, priority:number) : void {
        var $ = this.paint.$;
        
        var indicator = $('<div class="bottomIndicator" />').append(item);
        $("#bottomBar").append(indicator);
    }
    
    /*
        addToolbarIcon()
        addIndicator()
        addMenuItem()
        ...
    */

}