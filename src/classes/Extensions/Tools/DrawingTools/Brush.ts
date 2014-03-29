import glob = require('../../../Global');
import drawTool = require('./DrawingTool');
import point = require('../../../Point');

export class Brush extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Brush";
    paint : glob.Paint;
    
    lastPointDrawed : point.Point;
    brush : HTMLImageElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
        
        this.brush = paint.document.createElement('img');
        this.brush.src = "classes/Extensions/Tools/DrawingTools/brush21.png";
        this.brush.width = 1;
        this.brush.height = 1;
    }
    
    init() {
        this.addToolbarToolItem(null, "Brush");
    }
    
    activated() {
        super.activated();
    }
        
    /**
     * Gets function that draw on context
     */
    getDrawingFunction(newPoint : point.Point) : (context : CanvasRenderingContext2D) => void {

        if (!this.lastPointDrawed) 
            return function() {};
        
        var distance = this.lastPointDrawed.distanceFrom(newPoint),
            angle = this.lastPointDrawed.angleFrom(newPoint),
            brush = this.brush,
            lastPoint = this.lastPointDrawed,
            halfBrushW = this.brush.width * this.paint.toolSize / 2,
            halfBrushH = this.brush.height * this.paint.toolSize / 2;
        
        return this.paint.$.proxy(function(context : CanvasRenderingContext2D) {
            var x,y;
 
            for ( var z = 0; (z <= distance || z == 0); z++ ) {
                x = lastPoint.X + (Math.sin(angle) * z) - halfBrushW;
                y = lastPoint.Y + (Math.cos(angle) * z) - halfBrushH;
                context.drawImage(brush, x, y, this.paint.toolSize * this.brush.width, this.paint.toolSize * this.brush.height);
            }
        }, this);
    }
       
    canvas_mousedown(ev : JQueryMouseEventObject) {
        super.canvas_mousedown(ev);
        this.lastPointDrawed = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
    }
    
    canvas_mouseenter(ev : JQueryMouseEventObject) {
       if (this.paint.currentPaper.isDrawing()){
           this.lastPointDrawed = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
           this.paint.currentPaper.startDrawing(this.lastPointDrawed, null, null);
        }
    }

    document_mousemove(ev : JQueryMouseEventObject) {
        
        var newPoint = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.recordOuterPoint(newPoint);
        
        if (ev.target === this.paint.currentPaper.canvas && this.paint.currentPaper.isDrawing()) {
            
            // Call draw passing local drawing function
            this.paint.currentPaper.draw(
                this.getDrawingFunction(newPoint)
            );
            
            this.lastPointDrawed = newPoint;
        }
    }
    
    document_mouseup(ev) {
        super.document_mouseup(ev);
        this.lastPointDrawed = null;
    }
}