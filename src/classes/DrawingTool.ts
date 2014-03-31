import glob = require('./Global');
import tool = require('./Tool');
import point = require('./Point');
import color = require('./Color');

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
        $(canvas).on("mouseenter", $.proxy(this.canvas_mouseenter, this));
        $(document).on("mousemove", $.proxy(this.document_mousemove, this));
        $(canvas).on("mouseleave", $.proxy(this.canvas_mouseleave, this));
        $(document).on("mouseup", $.proxy(this.document_mouseup, this));
    }
    
    deactivated() {
        super.deactivated();
        
        var $ = this.paint.$;
        var document = this.paint.document;
        var canvas = this.paint.currentPaper.canvas;
        
        $(canvas).off("mousedown", this.canvas_mousedown);
        $(canvas).off("mouseenter", this.canvas_mouseenter);
        $(document).off("mousemove", this.document_mousemove);
        $(canvas).off("mouseleave", this.canvas_mouseleave);
        $(document).off("mouseup", this.document_mouseup);       
    }

    inkColor() : color.Color {
        return color.Colors.Black;
    }
    
    /**
     * Called when user starts drawing
     */
    onStartDrawing(point : point.Point) {
    
    }
    
    /**
     * Called when user stops drawing
     */
    onStopDrawing() {
    
    }
    
    /**
     * Called when the user is drawing and the mouse,
     * gone outside the canvas, gets back in.
     */
    onDrawFromOutside() {
        
    }
    
    get lastPoint() : point.Point {
        return this._lastPoint;
    }
    
    set lastPoint(value:point.Point) {
        this._lastPoint = value;
    }
    
    /** Gets function that draw on context
     *  \param pt point in canvas coordinates  
     */
    getDrawingFunction(pt : point.Point) : (context : CanvasRenderingContext2D) => void {
        throw "Cannot call this method directly. Please extend DrawingTool and implement this method in your class.";
    }

    private canvas_mousedown(ev : JQueryMouseEventObject) {
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.startDrawing(new point.Point(cord.X, cord.Y), this.inkColor(), this.paint.toolSize);
        this.onStartDrawing(new point.Point(cord.X, cord.Y));
    }

    private canvas_mouseenter(ev : JQueryMouseEventObject) {
        if (this.paint.currentPaper.isDrawing()) {
            var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
            this.paint.currentPaper.startDrawing(new point.Point(cord.X, cord.Y), this.inkColor(), this.paint.toolSize);
            this.onDrawFromOutside();
        }
    }
    
    private document_mousemove(ev : JQueryMouseEventObject) {
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.recordOuterPoint(cord);
        this._lastPoint = cord;
        
        if (ev.target === this.paint.currentPaper.canvas)
            
            // Call draw passing local drawing function
            this.paint.currentPaper.draw(
                this.getDrawingFunction(new point.Point(cord.X, cord.Y))
            );
    }
  
    private canvas_mouseleave(ev) {
        var point = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.exitFromPaper(this.paint.$.proxy(this.getDrawingFunction(point),this));
    }
        
    private document_mouseup(ev) {
        this.paint.currentPaper.stopDrawing();
        this.onStopDrawing();
    }  
}