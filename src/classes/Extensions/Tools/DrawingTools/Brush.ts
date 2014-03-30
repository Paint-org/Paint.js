import glob = require('../../../Global');
import drawTool = require('./DrawingTool');
import point = require('../../../Point');

export class Brush extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Brush";
    paint : glob.Paint;
    
    _lastPt : point.Point = null;
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
    
    onStartDrawing(point : point.Point) {
        super.onStartDrawing(point);
        this._lastPt = point;
        this.paint.currentPaper.draw(
            this.getDrawingFunction(this._lastPt)
        );
    }
    
    onStopDrawing() {
        this._lastPt = null;
    }
    
    onDrawFromOutside() {
        //this._lastPt = null;
    }
        
    /**
     * Gets function that draw on context
     */
    getDrawingFunction(newPoint : point.Point) : (context : CanvasRenderingContext2D) => void {

        if (this._lastPt === null) 
            return function() {};
        
        var distance = this._lastPt.distanceFrom(newPoint),
            angle = this._lastPt.angleFrom(newPoint),
            brush = this.brush,
            lastPoint = this._lastPt,
            halfBrushW = this.brush.width * this.paint.toolSize / 2,
            halfBrushH = this.brush.height * this.paint.toolSize / 2;
        
        this._lastPt = newPoint;
        
        return this.paint.$.proxy(function(context : CanvasRenderingContext2D) {
            var x,y;
 
            for ( var z = 0; (z <= distance || z == 0); z++ ) {
                x = lastPoint.X + (Math.sin(angle) * z) - halfBrushW;
                y = lastPoint.Y + (Math.cos(angle) * z) - halfBrushH;
                context.drawImage(brush, x, y, this.paint.toolSize * this.brush.width, this.paint.toolSize * this.brush.height);
            }
        }, this);
    }
}