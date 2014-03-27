import glob = require('../../Global');
import color = require('../../Color');
import tool = require('./Tool');
import toolPen = require('./Pen');
import point = require('../../Point');

export class Brush extends tool.Tool
{
    static EXTENSION_NAME : string = "Brush";
    paint : glob.Paint;
    
    lastPointDrawed : point.Point;
    brush : HTMLImageElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
        
        this.brush = paint.document.createElement('img');
        this.brush.src = "classes/Extensions/Tools/brush21.png";
    }
    
    init() {
        var paint = this.paint;
        var $ = paint.$;
        $("#topBar").append('<button id="btnBrush">Brush</button>');
        
        var curInstance = this;
        $("#btnBrush").click(function() {
            paint.currentTool = curInstance;
        });
    }

    activated() {
        super.activated();
        
        console.log("Registrazione del tool Brush");
        
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
        var $ = this.paint.$;
        var document = this.paint.document;
        var canvas = this.paint.currentPaper.canvas;
        
        $(canvas).off("mousedown", this.canvas_mousedown);
        $(canvas).off("mouseenter", this.canvas_mouseenter);
        $(document).off("mousemove", this.document_mousemove);
        $(canvas).off("mouseleave", this.canvas_mouseleave);
        $(document).off("mouseup", this.document_mouseup);
    }
        
    /**
     * Gets function that draw on context
     */
    private getDrawingFunction(newPoint : point.Point) : (context : CanvasRenderingContext2D) => void {

        var distance = this.lastPointDrawed.distanceFrom(newPoint),
            angle = this.lastPointDrawed.angleFrom(newPoint),
            brush = this.brush,
            lastPoint = this.lastPointDrawed,
            halfBrushW = this.brush.width / 2,
            halfBrushH = this.brush.height / 2;
        
        return function(context : CanvasRenderingContext2D) {
            var x,y;
 
            for ( var z = 0; (z <= distance || z == 0); z++ ) {
                x = lastPoint.X + (Math.sin(angle) * z) - halfBrushW;
                y = lastPoint.Y + (Math.cos(angle) * z) - halfBrushH;
                context.drawImage(brush, x, y);
            }
        }
    }
    
    private canvas_mousedown(ev : JQueryMouseEventObject) {
        
        this.lastPointDrawed = new point.Point(ev.offsetX, ev.offsetY)
        this.paint.currentPaper.startDrawing(this.lastPointDrawed, null, null);
    }
    
    private canvas_mouseenter(ev : JQueryMouseEventObject) {
        
        if (this.paint.currentPaper.isDrawing()){
            this.lastPointDrawed = new point.Point(ev.offsetX, ev.offsetY)
            this.paint.currentPaper.startDrawing(this.lastPointDrawed, null, null);
        }
    }
    
    private document_mousemove(ev : JQueryMouseEventObject) {
        
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        var newPoint = new point.Point(ev.offsetX, ev.offsetY);
        
        this.paint.currentPaper.recordOuterPoint(cord);
        
        if (ev.target === this.paint.currentPaper.canvas && this.paint.currentPaper.isDrawing()) {
            
            // Call draw passing local drawing function
            this.paint.currentPaper.draw(
                this.getDrawingFunction(newPoint)
            );
            
            this.lastPointDrawed = newPoint;
        }
    }
  
    private canvas_mouseleave(ev) {
        var point = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.exitFromPaper(point);
    }
        
    private document_mouseup(ev) {
        this.paint.currentPaper.stopDrawing();
        this.lastPointDrawed = null;
    }
}