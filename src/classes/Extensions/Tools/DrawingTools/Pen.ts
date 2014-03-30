import glob = require('../../../Global');
import color = require('../../../Color');
import drawTool = require('./DrawingTool');
import point = require('../../../Point');
   
export class Pen extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Pen";
    paint : glob.Paint;
    private _lastPt : point.Point = null;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        this.addToolbarToolItem(null, "Pen");
    }

    activated() {
        super.activated();
    }    
    
    inkColor() : color.Color {
        return this.paint.primaryColor;
    }
    
    onStartDrawing(point : point.Point) {
        super.onStartDrawing(point);
        this._lastPt = null;
        this.paint.currentPaper.draw(
            this.getDrawingFunction(point)
        );
    }
    
    onDrawFromOutside() {
        super.onDrawFromOutside();
        this._lastPt = null;
    }
    
    getDrawingFunction(pt : point.Point) : (context : CanvasRenderingContext2D) => void {
        var _this = this;
        
        return function(context : CanvasRenderingContext2D) {
            if (_this._lastPt !== null) {
                // Iniziamo un nuovo path e ci posizioniamo sull'ultimo punto disegnato
                context.closePath();
                context.beginPath();
                context.moveTo(_this._lastPt.X, _this._lastPt.Y);
            }
            
            
            context.lineTo(pt.X, pt.Y);
            context.stroke();
            
            // Disegna un cerchio sul punto finale
            context.beginPath();
            context.arc(pt.X, pt.Y, _this.paint.toolSize / 2, 0, 2 * Math.PI, false);
            context.fillStyle = 'black';
            context.fill();
            
            context.moveTo(pt.X, pt.Y);
            
            _this._lastPt = pt;
        }
    }
}