import glob = require('./Global');
import paper = require('./Paper');
import extension = require('./Extension');
import point = require('./Point');

/**
 * A Tool is an instrument that the user uses to do an action on the canvas.
 * Examples of tools are the selection tool, the pen, the brush,
 * the fill instrument, the rectangle shape, etc.
 */
export class Tool extends extension.Extension
{
    private drawing = false;
    
    constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        super.init();
        this.paint.registerTool(this);
    }
    
    /**
     * Gets called when the user selects this tool.
     * \param id id of the HTMLElement associated with activation event if exists
     */
    activated(id:string) {
        
        var $ = this.paint.$,
            document = this.paint.document,
            paper = this.paint.currentPaper.paperElement;
        
        $(paper).on("click", $.proxy(this.paper_click,this));
        $(paper).on("mousedown", $.proxy(this.paper_mousedown, this));
        
        $(document).on("mousemove", $.proxy(this.document_mousemove, this));
        $(document).on("mouseup", $.proxy(this.document_mouseup, this));     
    }
    
    /**
     * Gets called when the user selects another tool.
     */
    deactivated() {
        
        var $ = this.paint.$,
            document = this.paint.document,
            paper = this.paint.currentPaper.paperElement;
        
        $(paper).off("click", $.proxy(this.paper_click,this));        
        $(paper).off("mousedown", this.paper_mousedown);
        
        $(document).off("mousemove", this.document_mousemove);
        $(document).off("mouseup", this.document_mouseup);       
    }
    
    get isActive() : boolean {
        return this.paint.currentTool === this;
    }
    
    /**
     * Called when user starts drawing
     */
    onStartDrawing(paper:paper.Paper, point:point.Point) {
    
    }
    
    onDraw(paper:paper.Paper, point:point.Point) {
    
    }
    
    /**
     * Called when user stops drawing
     */
    onStopDrawing(paper:paper.Paper, point:point.Point) {
    
    }
    
    onPaperClick(pt : point.Point) {
    
    }    
    
    
    /**
     * Adds an icon inside the toolbar, in the tools category.
     * \returns The id of the new HTML element.
     */
    addToolbarToolItem(icon, text:string) : string {
        var $ = this.paint.$;
        
        var escapedStr = $('<div />').text(text).html();
        var id = extension.Extension.getUniqueHtmlId();
        
        //$("#tools").append('<button id="' + id + '">' + escapedStr + '</button>');
        $("#tools").append('<div class="smallicon" id="' + id + '">\
                              <img src="libs/ribbon/Icons/IgnoreConversation.png" width="16" height="16" />\
                              <div class="iconlegend"></div>\
                            </div>');
        
        var containerHeight = $("#tools").height();
        var iconHeight = 24; //$("#tools").height();
        var iconWidth = 24; //$("#tools").width();
        var epsilon = 3;
        var n = $("#tools").children(".smallicon").length;
        
        $("#tools").css('width', (iconWidth + epsilon) * Math.ceil(n / 3));
        
        $("#" + id).css('display', 'inline-block');
        $("#" + id).attr('title', escapedStr);
        
        $("#" + id).click($.proxy(function() {
            this.paint.setCurrentTool(this, id);
        }, this));
        
        return id;
    }
    
    // Event handler
    private paper_click(ev : JQueryMouseEventObject) {
        var cord = this.paint.currentPaper.pageXYtoPaperXY(ev.pageX, ev.pageY);
        this.onPaperClick(cord);
    }
     
    private paper_mousedown(ev : JQueryMouseEventObject) {
        this.drawing = true;
        var cord = this.paint.currentPaper.pageXYtoPaperXY(ev.pageX, ev.pageY);
        this.onStartDrawing(this.paint.currentPaper, cord);
    }
    
    private document_mousemove(ev : JQueryMouseEventObject) {
        if(this.drawing) {
            var cord = this.paint.currentPaper.pageXYtoPaperXY(ev.pageX, ev.pageY);
            this.onDraw(this.paint.currentPaper, cord);
        }
    }
        
    private document_mouseup(ev) {
        if(this.drawing) {
            this.drawing = false;
            var cord = this.paint.currentPaper.pageXYtoPaperXY(ev.pageX, ev.pageY);
            this.onStopDrawing(this.paint.currentPaper, cord);
        }
    }  
}