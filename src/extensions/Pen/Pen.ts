import glob = require('../../classes/Global');
import color = require('../../classes/Color');
import tool = require('../../classes/Tool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import paperLayer = require('../../classes/PaperLayer');
   
class Pen extends tool.Tool
{
    public EXTENSION_NAME : string = "com.paintjs.Pen";
    paint : glob.Paint;
    
    private _layer : paperLayer.PaperLayer;
    private _points : point.Point[] = [];
    
    public constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        super.init();
        this.addToolbarToolItem(null, "Pen");
    }

    activated(id:string) {
        super.activated(id);
        this.paint.currentPaper.setCursorFromURL("cursors/brush.cur");
    }
    
    deactivated() {
        super.deactivated();
        this.paint.currentPaper.restoreCursor();
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        
        this._points = [];
        
        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        this.onDraw(paper, point);
    }
    
    onDraw(paper:paper.Paper, point:point.Point) {
        super.onDraw(paper, point);
        
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;
        
        this._points.push(point);
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        
        var len = this._points.length;
        
        if(len == 1) {
            // FIXME Draw a dot 
            
        } else if(len == 2) {
            context.moveTo(this._points[0].X, this._points[0].Y);
            context.lineTo(point.X, point.Y);
            
        } else {
           
            // move to the first point
            context.moveTo(this._points[0].X, this._points[0].Y);
            
            for (var i = 1; i < len - 2; i++) {
                var xc = (this._points[i].X + this._points[i + 1].X) / 2;
                var yc = (this._points[i].Y + this._points[i + 1].Y) / 2;
                context.quadraticCurveTo(this._points[i].X, this._points[i].Y, xc, yc);
            }
            
            // curve through the last two points
            context.quadraticCurveTo(this._points[i].X, this._points[i].Y, this._points[i+1].X,this._points[i+1].Y);
            
        }
        
        context.stroke();
        context.closePath();
    }
    
    onStopDrawing(paper:paper.Paper, point:point.Point) {
        super.onStopDrawing(paper, point);
        
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);
        
        this._points = [];
    }
}

exports.Extensions = new Array();
exports.Extensions.push(Pen);