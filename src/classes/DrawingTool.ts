import glob = require('./Global');
import tool = require('./Tool');
import point = require('./Point');
import color = require('./Color');
import paper = require('./Paper');

export class DrawingTool extends tool.Tool
{
    paint : glob.Paint;
    private _lastPoint : point.Point = null;
    
    constructor(paint : glob.Paint){
        super(paint);
    }
    
    /**
     * Gets called when the user selects this tool.
     * \param id id of the HTMLElement associated with activation event if exists
     */    
    activated(id : string) {
        super.activated(id);
        
        var paint = this.paint;
        var $ = paint.$;
        var document = paint.document;
        
        // Load context
        var paper = paint.currentPaper.paperElement;
        
        $(paper).on("mousedown", $.proxy(this.paper_mousedown, this));
        $(document).on("mousemove", $.proxy(this.document_mousemove, this));
        $(document).on("mouseup", $.proxy(this.document_mouseup, this));
    }
    
    deactivated() {
        super.deactivated();
        
        var $ = this.paint.$;
        var document = this.paint.document;
        var paper = this.paint.currentPaper.paperElement;
        
        $(paper).off("mousedown", this.paper_mousedown);
        $(document).off("mousemove", this.document_mousemove);
        $(document).off("mouseup", this.document_mouseup);       
    }

    inkColor() : color.Color {
        return color.Color.Black;
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
    
    private drawing = false;

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