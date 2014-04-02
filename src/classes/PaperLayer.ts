import glob = require('./Global');
import pt = require('./Point');
import color = require('./Color');
import paper = require('./Paper');
import colorMatrix = require('./ColorMatrix');

export class PaperLayer {
    
    private _paint : glob.Paint;
    private _context : CanvasRenderingContext2D;
    
    private _zoom : number = 1;
    private _background : color.Color = null;
    
    public canvas : HTMLCanvasElement;
    
    /**
     * Create a new PaperLayer.
     * \param background the background color of the layer. If null, it's transparent.
     */
    constructor(paint:glob.Paint, canvas:HTMLCanvasElement, background:color.Color) {

        this._paint = paint;
        
        this.canvas = canvas;
        this._context = canvas.getContext('2d');
        this._background = background;
        
        this.fillBackground(background);
    }
    
    getContext():CanvasRenderingContext2D {
        return this._context;
    }
    
    getPixelMatrix() : colorMatrix.ColorMatrix {
        
        var imgd = this._context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var matr = new colorMatrix.ColorMatrix(imgd.data, imgd.width, imgd.height);
        
        return matr;
    }
    
    copyTo(layer:PaperLayer) {
        layer._context.drawImage(this.canvas, 0, 0);
    }
    
    private fillBackground(color : color.Color) {
        if(color != null) {
            this._context.save();
            this._context.setTransform(1, 0, 0, 1, 0, 0);
            this._context.fillStyle = color.HexString;
            this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this._context.restore();
        }
    }
    
    restoreImage(savedCanvas : HTMLCanvasElement) { 
        this.fillBackground(this._background);
        this.getContext().drawImage(savedCanvas, 0, 0);
    }
}