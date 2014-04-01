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
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        this._lastPt = null;
        
        var context = paper.getContext();
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;
        context.beginPath();
        
        this.onDraw(this.paint.currentPaper, point);
    }
    
    onDraw(paper:paper.Paper, point:point.Point) {
        super.onDraw(paper, point);
        
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
    
    onStopDrawing(paper:paper.Paper, point:point.Point) {
        super.onStopDrawing(paper, point);
        paper.getContext().closePath();
    }
}