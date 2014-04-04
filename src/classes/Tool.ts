import glob = require('./Global');
import extension = require('./Extension');
import point = require('./Point');

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
    }
    
    init() {
    }
    
    /**
     * Gets called when the user selects this tool.
     * \param id id of the HTMLElement associated with activation event if exists
     */
    activated(id:string) {
        var $ = this.paint.$;
        
        $(this.paint.currentPaper.paperElement).on("click", $.proxy(this.paper_click,this));
    }
    
    /**
     * Gets called when the user selects another tool.
     */
    deactivated() {
        var $ = this.paint.$;
        
        $(this.paint.currentPaper.paperElement).off("click", $.proxy(this.paper_click,this));
    }
    
    /**
     * Adds an icon inside the toolbar, in the tools category.
     * \returns The id of the new HTML element.
     */
    addToolbarToolItem(icon, text:string) : string {
        var $ = this.paint.$;
        
        var escapedStr = $('<div />').text(text).html();
        var id = extension.Extension.getUniqueHtmlId();
        
        $("#tools").append('<button id="' + id + '">' + escapedStr + '</button>');
        
        $("#" + id).click($.proxy(function() {
            this.paint.setCurrentTool(this, id);
        }, this));
        
        return id;
    }
    
    onPaperClick(pt : point.Point) {
    }
    
    private paper_click(ev : JQueryMouseEventObject) {
        var cord = this.paint.currentPaper.pageXYtoPaperXY(ev.pageX, ev.pageY);
        this.onPaperClick(cord);
    }    
}