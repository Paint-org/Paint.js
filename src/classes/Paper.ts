/// <reference path="../libs/jquery/jquery.d.ts" />

import glob = require('./Global');
import pt = require('./Point');
import color = require('./Color');
import colorMatrix = require('./ColorMatrix');

export class Paper {
    
    private _paint : glob.Paint;
    private _context : CanvasRenderingContext2D;
    
    private _zoom : number = 1;
    
    public canvas : HTMLCanvasElement;
    
    constructor(paint : glob.Paint) {

        this._paint = paint;
        
        this.canvas = <HTMLCanvasElement> this._paint.$('#paper')[0];
        this._context = this.canvas.getContext('2d');
        
        this.fillBackground(color.Color.White);
    }
    
    getContext():CanvasRenderingContext2D {
        return this._context;
    }
    
    pageXYtoCanvasXY(x:number, y:number) : pt.Point {
        var offset = this._paint.$(this.canvas).parent().offset();
        return new pt.Point(
          Math.round((x - offset.left) / this._zoom),
          Math.round((y - offset.top) / this._zoom)
        );
    }
    
    getPixelMatrix() : colorMatrix.ColorMatrix {
        
        var imgd = this._context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var matr = new colorMatrix.ColorMatrix(imgd.data, imgd.width, imgd.height);
        
        return matr;
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
    
    save(filename, callback) {
        var image = this.canvas.toDataURL();
        image = image.replace(/^data:image\/png;base64,/,"");
        
        var fs = require('fs');
        fs.writeFile(filename, image, "base64", callback); 
    }
    
    private fillBackground(color : color.Color) {
        this._context.fillStyle = color.HexString;
        this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    restoreImage(savedCanvas : HTMLCanvasElement) { 
        this.fillBackground(color.Color.White);
        this.getContext().drawImage(savedCanvas, 0, 0);
    }
}