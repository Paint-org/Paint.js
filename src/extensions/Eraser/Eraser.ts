import glob = require('../../classes/Global');
import color = require('../../classes/Color');
import tool = require('../../classes/Tool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import canvasMatrix = require('../../classes/CanvasMatrix');
import paperLayer = require('../../classes/PaperLayer');
   
export class Eraser extends tool.Tool
{
    public EXTENSION_NAME : string = "com.paintjs.Eraser";
    paint : glob.Paint;
    
    private _layer : paperLayer.PaperLayer;
    private _points : point.Point[] = [];
    
    public constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        super.init();
        this.addToolbarToolItem(null, "Eraser");
    }

    activated(id : string) {
        super.activated(id);
        this.onToolSizeChanged();
    }
    
    deactivated() {
        super.deactivated();
        this.paint.currentPaper.restoreCursor();
    }
    
    onToolSizeChanged() {
        if(this.isActive) {
            var size = this.paint.toolSize;
            
            var cur = this.getCursorForSize(size);
            this.paint.currentPaper.setCursorFromURL(cur, size/2, size/2);
        }
    }
    
    private getCursorForSize(size:number) : string {
        var $ = this.paint.$;
        
        var newCanvas = $('<canvas />')
        newCanvas.css('position', 'absolute');
        newCanvas.css('top', 0);
        newCanvas.css('left', 0);
        newCanvas.attr("width", size);
        newCanvas.attr("height", size);
        
        var el = <HTMLCanvasElement>newCanvas[0];
        var ctx = el.getContext('2d');
        
        ctx.fillStyle = color.Color.White.HexString;
        ctx.fillRect(0, 0, size, size);
        
        var mat = new canvasMatrix.CanvasMatrix(ctx.getImageData(0, 0, size, size));
        
        paperLayer.PaperLayer.drawAliasedLine(0, 0, size-1, 0, 1, color.Color.Black, mat.colorMatrix);
        paperLayer.PaperLayer.drawAliasedLine(0, 0, 0, size-1, 1, color.Color.Black, mat.colorMatrix);
        paperLayer.PaperLayer.drawAliasedLine(size-1, 0, size-1, size-1, 1, color.Color.Black, mat.colorMatrix);
        paperLayer.PaperLayer.drawAliasedLine(0, size-1, size-1, size-1, 1, color.Color.Black, mat.colorMatrix);
        
        mat.apply(ctx);
        
        return el.toDataURL();
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        
        this._points = [];
        
        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.secondaryColor.HexString;
        context.lineCap = 'square';
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