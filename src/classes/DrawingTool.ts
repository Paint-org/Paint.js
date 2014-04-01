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
    
    activated() {
        super.activated();
        
        var paint = this.paint;
        var $ = paint.$;
        var document = paint.document;
        
        // Load context
        var canvas = paint.currentPaper.canvas;
    
        $(canvas).on("mousedown", $.proxy(this.canvas_mousedown, this));
        $(document).on("mousemove", $.proxy(this.document_mousemove, this));
        $(document).on("mouseup", $.proxy(this.document_mouseup, this));
    }
    
    deactivated() {
        super.deactivated();
        
        var $ = this.paint.$;
        var document = this.paint.document;
        var canvas = this.paint.currentPaper.canvas;
        
        $(canvas).off("mousedown", this.canvas_mousedown);
        $(document).off("mousemove", this.document_mousemove);
        $(document).off("mouseup", this.document_mouseup);       
    }

    inkColor() : color.Color {
        return color.Color.Black;
    }
    
    /**
     * Called when user starts drawing
     */
    onStartDrawing(point : point.Point) {
    
    }
    
    onDraw(paper : paper.Paper, point : point.Point) {
    
    }
    
    /**
     * Called when user stops drawing
     */
    onStopDrawing() {
    
    }
    
    private drawing = false;

    private canvas_mousedown(ev : JQueryMouseEventObject) {
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.drawing = true;
        this.onStartDrawing(new point.Point(cord.X, cord.Y));
    }
    
    private document_mousemove(ev : JQueryMouseEventObject) {
        if(this.drawing) {
            var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
            this.onDraw(this.paint.currentPaper, cord);
        }
    }
        
    private document_mouseup(ev) {
        this.drawing = false;
        this.onStopDrawing();
    }  
}