import glob = require('../../classes/Global');
import drawTool = require('../../classes/DrawingTool');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import color = require('../../classes/Color');

export class Brush extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Brush";
    paint : glob.Paint;
    
    private _lastPt : point.Point = null;
    private image : HTMLImageElement;
    private brush : HTMLImageElement;
    private coloredBrush : HTMLImageElement;
    
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
    
    activated(id : string) {
        super.activated(id);
    }
    
    onStartDrawing(paper:paper.Paper, point:point.Point) {
        super.onStartDrawing(paper, point);
        
        this._lastPt = point;
        
        this.coloredBrush = this.getColoredBrush(this.paint.primaryColor);

        this.onDraw(paper, point);
    }
    
    onStopDrawing(paper:paper.Paper, point:point.Point) {
        super.onStopDrawing(paper, point);
        this._lastPt = null;
    }
    
    private getColoredBrush(color:color.Color) : HTMLImageElement {
        var $ = this.paint.$;
        
        // Remove size so that we can get real width and height
        this.brush.removeAttribute('width');
        this.brush.removeAttribute('height');
        
        // Put the image on a temp canvas
        var newCanvas = <HTMLCanvasElement>$('<canvas />')[0];
        newCanvas.width = this.brush.width;
        newCanvas.height = this.brush.height;
        
        var ctx = newCanvas.getContext('2d');
        ctx.drawImage(
            this.brush, 
            0, 
            0
        );
        
        // Restore size
        this.brush.width = 1;
        this.brush.height = 1;
        
        // Change colors
        
        var img = ctx.getImageData(0, 0, newCanvas.width, newCanvas.height);
        var len = img.data.length;
        
        for(var i = 0; i < len; i+=4) {
            if(img.data[i + 3] > 0) // If it's not a transparent pixel
            {
                img.data[i] = (255-img.data[i]) / 255 * color.R;
                img.data[i + 1] = (255-img.data[i + 1]) / 255 * color.G;
                img.data[i + 2] = (255-img.data[i + 2]) / 255 * color.B;
            }
        }
        
        ctx.putImageData(img, 0, 0);
        
        // Assign the image to an img element
        var image = this.paint.document.createElement('img');
        image.src = newCanvas.toDataURL();
        image.width = 1;
        image.height = 1;
        
        return image;
    }
        
    /**
     * Gets function that draw on context
     */
    onDraw(paper:paper.Paper, point:point.Point) {
        var context = paper.baseLayer.getContext();
        
        if (this._lastPt === null || this._lastPt.equals(point)) 
            return;
        
        var distance = this._lastPt.distanceFrom(point),
            angle = this._lastPt.angleFrom(point);
        
        var sinAngle = (point.X - this._lastPt.X) / distance,
            cosAngle = (point.Y - this._lastPt.Y) / distance;
        
        var x = this._lastPt.X - this.brush.width * this.paint.toolSize / 2;
        var y = this._lastPt.Y - this.brush.height * this.paint.toolSize / 2;
         
        // Update last point
        this._lastPt = point;
        
        for ( var z = 0; (z <= distance || z == 0); z++, x += sinAngle, y += cosAngle ) {
            context.drawImage(
                this.coloredBrush, 
                x, 
                y,
                this.brush.width * this.paint.toolSize,
                this.brush.height * this.paint.toolSize
            );
        }
    }
}