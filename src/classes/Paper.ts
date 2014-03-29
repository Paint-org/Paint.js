/// <reference path="../libs/jquery/jquery.d.ts" />

import glob = require('./Global');
import pt = require('./Point');
import color = require('./Color');

export class Paper {
    
    private _paint : glob.Paint;
    private _context : CanvasRenderingContext2D;
    
    private _isDrawing = false;
    private _started = false;
    
    private _lastPoint : pt.Point;
    private _zoom : number = 1;
    
    public canvas : HTMLCanvasElement;
    
    
    constructor(paint : glob.Paint) {

        this._paint = paint;
        
        this.canvas = <HTMLCanvasElement> this._paint.$('#paper')[0];
        this._context = this.canvas.getContext('2d');
    }
    
    getContext():CanvasRenderingContext2D {
        return this._context;
    }
    
    pageXYtoCanvasXY(x:number, y:number) : pt.Point {
        return new pt.Point(
          Math.round((x - this._paint.$(this.canvas).parent().offset().left) / this._zoom),
          Math.round((y - this._paint.$(this.canvas).parent().offset().top) / this._zoom)
        );
    }
    
    isDrawing():boolean {
        return this._isDrawing;
    }
    
    startDrawing(startPoint : pt.Point, color : color.Color, size : number) {
        
        // if already drawing, then draw from _lastPoint to make
        // line continuos between mousemove point in canvas
        // and the border 
        if (this._isDrawing) {
            this._context.moveTo(this._lastPoint.X, this._lastPoint.Y);
            this._context.beginPath();
            this._context.lineTo(this._lastPoint.X, this._lastPoint.Y);
            this._started = true;
        } else {
            this._context.moveTo(startPoint.X, startPoint.Y);
            this._context.beginPath();
            this._isDrawing = true;
            this._started = false;
        }

        this._context.lineWidth = size;
        this._context.strokeStyle = (color === null) ? "" : color.toHex();
    }
    
    /**
     * Draw on Paper
     */
    draw(drawingFunction : (CanvasRenderingContext2D) => void):void {
        
        if (this._isDrawing)
            drawingFunction(this._context);
    }
    
    /**
     * Stop drawing
     */
    stopDrawing():void {
        this._isDrawing = false;
        this._context.closePath();
    }
    
    /**
     * When exit from Paper close the path
     */
    exitFromPaper(point : pt.Point):void {

        if (this.isDrawing()) {
            this._context.lineTo(point.X, point.Y);
            this._context.stroke();
            this._context.closePath();
        }
    }
    
    /**
     * When going to enter in Paper remember last outer point to make line continuos
     * from outer and inner canvas
     */
    recordOuterPoint(point : pt.Point) {
        this._lastPoint = point;
    }
    
    getPixelMatrix() : number[][][] {
        console.time("getPixelMatrix");
        var imgd = this._context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var pix = imgd.data;
        var width = imgd.width;
        var height = imgd.height;
        
        var matrix : number[][][] = new Array(height);
        for(var i = 0; i < height; i++) {
            matrix[i] = new Array(width);

            var rowpix = i * width;
            for(var j = 0; j < width; j++) {
                var component = rowpix + j*4;
                
                matrix[i][j] = [
                    pix[component],
                    pix[component+1],
                    pix[component+2]
                ];
            }
        }
        
        console.timeEnd("getPixelMatrix");
        return matrix;
    }

    /*fillPosition(x:number, y:number, color:string):void {
        var imgd = this._context.getImageData(0, 0, this.canvas.width-1, this.canvas.height-1);
        var pix = imgd.data;
        
        var pixelSingleIndex = this.xyToIndex(x, y, this.canvas.width);
        var pixelIndex = pixelSingleIndex * 4; // Indice del pixel tenendo conto delle 4 componenti.
        
        var red = pix[pixelIndex],
            green = pix[pixelIndex + 1],
            blue = pix[pixelIndex + 2];
            // i+3 is the alpha
        
        var n = 4 * pix.length;
        var lastY = pixelSingleIndex % this.canvas.height;
        var fillPixels = [];
        
        for (var i = pixelIndex; i < n; i += 4) {
            var px = (i/4) % this.canvas.width;
            var py = (i/4) % this.canvas.height;
            
            //if(py > lastY) {
            //break;
            //
            
            if(pix[i  ] == red &&
               pix[i+1] == green &&
               pix[i+2] == blue) {
                
                fillPixels.push(i);
            }
        }
        
        for(var i = 0; i < fillPixels.length; i++) {
            pix[i  ] = 255;
            pix[i+1] = 0;
            pix[i+2] = 0;
        }
        
        // Draw the ImageData at the given (x,y) coordinates.
        this._context.putImageData(imgd, x, y);
    }*/
    
    /**
     * Converts from a XY representation to a single-index matrix
     * representation (going left->right, top->down).
     */
    private xyToIndex(x:number, y:number, width:number):number {
        return y*width + x;
    }
    
    /**
     * Imposta lo zoom del canvas (default = 1)
     */
    set Zoom(value:number) {

        var $ = this._paint.$;
        this._zoom = value;

        $(this.canvas).css('zoom', (value * 100) + '%');
        $("#paperWrapper").width(parseInt($(this.canvas).attr("width")) * value);
        $("#paperWrapper").height(parseInt($(this.canvas).attr("height")) * value);
    }

    get Zoom() : number {
        return this._zoom;    
    }    
}