import glob = require('../../../Global');
import color = require('../../../Color');
import drawTool = require('./DrawingTool');
import toolPen = require('./Pen');
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
    }
    
    init() {
        var paint = this.paint;
        var $ = paint.$;
        $("#topBar").append('<button id="btnBrush">Brush</button>');
        
        $("#btnBrush").click($.proxy(function() {
            paint.currentTool = this;
        }, this));
    }
    
    activated() {
        console.log("Registrazione del tool Brush");
        super.activated();
    }
        
    /**
     * Gets function that draw on context
     */
    getDrawingFunction(newPoint : point.Point) : (context : CanvasRenderingContext2D) => void {

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
    
    canvas_mousedown(ev : JQueryMouseEventObject) {
        super.canvas_mousedown(ev);
        
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.lastPointDrawed = cord;
    }
    
    canvas_mouseenter(ev : JQueryMouseEventObject) {
       if (this.paint.currentPaper.isDrawing()){
            var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
            this.lastPointDrawed = cord;
            this.paint.currentPaper.startDrawing(this.lastPointDrawed, null, null);
        }
    }

    document_mousemove(ev : JQueryMouseEventObject) {
        
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        var newPoint = cord;
        
        this.paint.currentPaper.recordOuterPoint(cord);
        
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