import glob = require('../../classes/Global');
import color = require('../../classes/Color');
import drawTool = require('../../classes/DrawingTool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
   
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
        
        var context = this.paint.currentPaper.getContext(); // FIXME Farsi passare il paper dai parametri
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;
        context.beginPath();
        
        this.onDraw(this.paint.currentPaper, point);
    }
    
    onDraw(paper : paper.Paper, point : point.Point) {
        var context = paper.getContext();
        
        if (this._lastPt !== null) {
            // Iniziamo un nuovo path e ci posizioniamo sull'ultimo punto disegnato
            context.closePath();
            context.beginPath();
            context.moveTo(this._lastPt.X, this._lastPt.Y);
        }
        
        context.lineTo(point.X, point.Y);
        
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        context.stroke();
        
        this._lastPt = point;
    }
    
    onStopDrawing() {
        var context = this.paint.currentPaper.getContext(); // FIXME Farsi passare il paper dai parametri
        context.closePath();
    }
}