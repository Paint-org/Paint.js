import glob = require('../../classes/Global');
import drawTool = require('../../classes/DrawingTool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');

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
        this.brush.src = "extensions/Brush/brush21.png";
        this.brush.width = 1;
        this.brush.height = 1;
    }
    
    init() {
        this.addToolbarToolItem(null, "Brush");
    }
    
    activated() {
        super.activated();
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        this._lastPt = point;
        
        var context = paper.getContext();
        this.onDraw(paper, point);
    }
    
    onStopDrawing(paper:paper.Paper, point:point.Point) {
        super.onStopDrawing(paper, point);
        this._lastPt = null;
    }
        
    /**
     * Gets function that draw on context
     */
    onDraw(paper:paper.Paper, point:point.Point) {
        var context = paper.getContext();
        
        if (this._lastPt === null) 
            return;
        
        var distance = this._lastPt.distanceFrom(point),
            angle = this._lastPt.angleFrom(point);
        
        var sinAngle = Math.sin(angle),
            cosAngle = Math.cos(angle);
        

        var x = this._lastPt.X - this.brush.width * this.paint.toolSize / 2;
        var y = this._lastPt.Y - this.brush.height * this.paint.toolSize / 2;
 
        for ( var z = 0; (z <= distance || z == 0); z++ ) {
            context.drawImage(
                this.brush, 
                x, 
                y, 
                this.paint.toolSize * this.brush.width, 
                this.paint.toolSize * this.brush.height
            );

            x += sinAngle;
            y += cosAngle;
        }
        
        // Update last point
        this._lastPt = point;
    }
}