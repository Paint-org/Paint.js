import glob = require('../../classes/Global');
import color = require('../../classes/Color');
import tool = require('../../classes/Tool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import paperLayer = require('../../classes/PaperLayer');
   


class Shape
{
    static name = "";
    static Draw(ctx : CanvasRenderingContext2D, startPoint : point.Point, endPoint : point.Point) {}
}

class Line extends Shape
{
    static name = "Line";
    
    static Draw(ctx : CanvasRenderingContext2D, startPoint : point.Point, endPoint : point.Point) {
    
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.moveTo(startPoint.X, startPoint.Y);
        ctx.lineTo(endPoint.X, endPoint.Y);
    }
}

class Rectangle extends Shape
{
    static name = "Rectangle";
    
    static Draw(ctx : CanvasRenderingContext2D, startPoint : point.Point, endPoint : point.Point) {
        ctx.moveTo(startPoint.X, startPoint.Y);
        
        var w = endPoint.X - startPoint.X,
            h = endPoint.Y - startPoint.Y;
        
        ctx.rect(startPoint.X, startPoint.Y, w, h); 
    }
}

class Ellipse extends Shape
{
    static name = "Ellipse";
    
    static Draw(ctx : CanvasRenderingContext2D, startPoint : point.Point, endPoint : point.Point) {
        
        var w = endPoint.X - startPoint.X,
            h = endPoint.Y - startPoint.Y;
        
        ctx.moveTo(startPoint.X, startPoint.Y + h/2 );

        ctx.bezierCurveTo(startPoint.X, startPoint.Y, endPoint.X, startPoint.Y, endPoint.X, endPoint.Y - h/2);
        ctx.moveTo(endPoint.X, endPoint.Y - h/2);
        ctx.bezierCurveTo(endPoint.X, endPoint.Y, startPoint.X, endPoint.Y, startPoint.X, endPoint.Y - h/2);
    }
}

// It contains associations between HTMLElement id and shapes
class Shapes
{
    private _shapes = {};
    
    addShape(id : string, cls : typeof Shape) {
        this._shapes[id] = cls;
    }
    
    getShape(id : string) : typeof Shape {
        return this._shapes[id];
    }
}

export class ShapeDrawer extends tool.Tool
{
    static EXTENSION_NAME : string = "ShapeDrawer";
    paint : glob.Paint;
    
    private _startPt : point.Point = null;
    private _layer : paperLayer.PaperLayer;
    private _oldCursor = "";
    
    private _shapes : Shapes;
    private _currentShape : typeof Shape;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this._shapes = new Shapes();
    }
    
    init() {
        
        // Add Rectangle shape
        this._shapes.addShape(
            this.addToolbarToolItem(null, Rectangle.name),
            Rectangle
        );
        
        // Add Line shape
        this._shapes.addShape(
            this.addToolbarToolItem(null, Line.name),
            Line
        );

        this._shapes.addShape(
            this.addToolbarToolItem(null, Ellipse.name),
            Ellipse
        );
        
    }
    
    activated(id:string) {
        super.activated(id);
        this.paint.currentPaper.setCursorFromURL("cursors/cross.cur");
        this._currentShape = this._shapes.getShape(id);
    }
    
    deactivated() {
        super.deactivated();
        this.paint.currentPaper.restoreCursor();
        this._currentShape = null;
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        
        this._startPt = point;
        
        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;
        
        this.onDraw(this.paint.currentPaper, point);
    }
    
    onDraw(paper:paper.Paper, point:point.Point) {
        super.onDraw(paper, point);
        
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;
        
        context.clearRect(0, 0, canvas.width, canvas.height);        
        context.beginPath();

        // Call drawing function of the selected shape
        this._currentShape.Draw(context, this._startPt, point);
        
        context.stroke();
        context.closePath();
    }
    
    onStopDrawing(paper:paper.Paper, point:point.Point) {
        super.onStopDrawing(paper, point);
        
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);
    }
}