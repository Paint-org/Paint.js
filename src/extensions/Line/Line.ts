import glob = require('../../classes/Global');
import color = require('../../classes/Color');
import drawTool = require('../../classes/DrawingTool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import paperLayer = require('../../classes/PaperLayer');
   
export class Line extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Line";
    paint : glob.Paint;
    
    private _startPt : point.Point = null;
    private _layer : paperLayer.PaperLayer;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        this.addToolbarToolItem(null, "Line");
    }

    activated() {
        super.activated();
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        
        this._startPt = point;
        
        this._layer = paper.addLayer(null);
        var context = paper.baseLayer.getContext();
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;

        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        this.onDraw(this.paint.currentPaper, point);
    }
    
    onDraw(paper:paper.Paper, point:point.Point) {
        super.onDraw(paper, point);
        
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.moveTo(this._startPt.X, this._startPt.Y);
        context.lineTo(point.X, point.Y);
        context.stroke();
        context.closePath();
    }
    
    onStopDrawing(paper:paper.Paper, point:point.Point) {
        super.onStopDrawing(paper, point);
        
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);
    }
}