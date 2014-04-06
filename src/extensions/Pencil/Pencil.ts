import glob = require('../../classes/Global');
import tool = require('../../classes/Tool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import paperLayer = require('../../classes/PaperLayer');
   
export class Pencil extends tool.Tool
{
    static EXTENSION_NAME : string = "com.paintjs.Pencil";
    paint : glob.Paint;
    private _lastPt : point.Point = null;
    
    public constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        super.init();
        this.addToolbarToolItem(null, "Pencil");
    }

    activated(id:string) {
        super.activated(id);
        this.paint.currentPaper.setCursorFromURL("cursors/pencil.cur");
    }
    
    deactivated() {
        super.deactivated();
        this.paint.currentPaper.restoreCursor();
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        
        this._lastPt = point;
        this.onDraw(paper, point);
    }
    
    onDraw(paper:paper.Paper, point:point.Point) {
        super.onDraw(paper, point);
        
        var matrix = paper.baseLayer.getCanvasMatrix();
        
        paperLayer.PaperLayer.drawAliasedLine(
            this._lastPt.X,
            this._lastPt.Y,
            point.X,
            point.Y,
            this.paint.toolSize,
            this.paint.primaryColor,
            matrix.colorMatrix);
        
        matrix.apply(paper.baseLayer.getContext());
        
        this._lastPt = point;
    }
}