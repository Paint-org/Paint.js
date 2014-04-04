import glob = require('../../classes/Global');
import color = require('../../classes/Color');
import drawTool = require('../../classes/DrawingTool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
   
export class Eraser extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Eraser";
    paint : glob.Paint;
    
    private _lastPt : point.Point = null;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        this.addToolbarToolItem(null, "Eraser");
    }

    activated(id : string) {
        super.activated(id);
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        
        this._lastPt = null;
        
        var context = paper.baseLayer.getContext();
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.secondaryColor.HexString;
        context.beginPath();
        
        this.onDraw(this.paint.currentPaper, point);
    }
    
    onDraw(paper:paper.Paper, point:point.Point) {
        super.onDraw(paper, point);
        
        var context = paper.baseLayer.getContext();
        
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
        
        paper.baseLayer.getContext().closePath();
    }
}