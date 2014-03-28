import glob = require('../Global');

export class Extension {
    static EXTENSION_NAME : string = "";
    
    private static htmlIdCount = 0;
    
    constructor(paint:glob.Paint) {
        
    }
    
    init() {
    
    }
    
    /**
     * Return a unique ID string to apply to dynamically generated HTML elements.
     */
    public static getNewHtmlId() : string {
        var count = this.htmlIdCount++;
        return 'uniq-dynamic-ext-id-' + count;
    }
    
    /*
        addToolbarIcon()
        addIndicator()
        addMenuItem()
        ...
    */

}