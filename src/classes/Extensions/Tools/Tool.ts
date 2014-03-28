import glob = require('../../Global');
import extension = require('../Extension');

/**
 * A Tool is an instrument that the user uses to do an action on the canvas.
 * Examples of tools are the selection tool, the pen, the brush,
 * the fill instrument, the rectangle shape, etc.
 */
export class Tool extends extension.Extension
{
    static EXTENSION_NAME : string = "";
    paint : glob.Paint;

    constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
    
    }
    
    /**
     * Gets called when the user selects this tool.
     */
    activated() {
        
    }
    
    /**
     * Gets called when the user selects another tool.
     */
    deactivated() {
        
    }
    
    /**
     * Adds an icon inside the toolbar, in the tools category.
     * \returns The id of the new HTML element.
     */
    addToolbarToolItem(icon, text:string) : string {
        var $ = this.paint.$;
        
        var escapedStr = $('<div />').text(text).html();
        var id = extension.Extension.getNewHtmlId();
        
        $("#tools").append('<button id="' + id + '">' + escapedStr + '</button>');
        
        $("#" + id).click($.proxy(function() {
            this.paint.currentTool = this;
        }, this));
        
        return id;
    }
}