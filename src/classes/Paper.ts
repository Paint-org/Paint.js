/// <reference path="../libs/jquery/jquery.d.ts" />

import glob = require('./Global');

export class Paper {
    
    private _paint : glob.Paint;
    private _context : CanvasRenderingContext2D;
    
    private _isDrawing = false;
    private _started = false;
    
    public canvas : HTMLCanvasElement;
    
    
    constructor(paint : glob.Paint) {

        this._paint = paint;
        
        this.canvas = <HTMLCanvasElement> this._paint.$('#paper')[0];
        this._context = this.canvas.getContext('2d');
    }
      
    getContext():CanvasRenderingContext2D {
        return this._context;
    }
    
    pageXYtoCanvasXY(x:number, y:number) {
        return {
            x: x - this._paint.$(this.canvas).parent().offset().left,
            y: y - this._paint.$(this.canvas).parent().offset().top
        };
    }
    
    isDrawing():boolean {
        return this._isDrawing;
    }
    
    startDrawing():void {
        this._isDrawing = true;
        this._started = false;
        
        this._context.lineWidth = this._paint.currentPen.width;
        this._context.strokeStyle = this._paint.currentPen.brush.color;
    }
    
    /**
     * Draw on Paper
     */
    draw(x:number, y:number):void {
        if (this._isDrawing) {
            if (!this._started) {

              this._context.moveTo(x, y);
              this._context.beginPath();
              this._context.lineTo(x, y);
              this._started = true;
                
            } else {
              this._context.lineTo(x, y);
              this._context.stroke();
            }
        }
    }
    
    /**
     * Start drawing on Paper from the corner 
     * it finds the closest edge and start drawing from it
     */
    drawFromEdge(x:number, y:number):void {
        if (this._isDrawing) {
                    
            // ricerca del bordo più vicino
            var dx = x < this._paint.$(this.canvas).width()/2 ? x : this._paint.$(this.canvas).width() - x,
                dy = y < this._paint.$(this.canvas).height()/2 ? y : this._paint.$(this.canvas).height() - y,
                newX = x,
                newY = y;
            
            if (dx < dy)
                newX = x < this._paint.$(this.canvas).width()/2 ? 0 : this._paint.$(this.canvas).width();
            else
                newY = y < this._paint.$(this.canvas).height()/2 ? 0 : this._paint.$(this.canvas).height();
            
            // inizio a disegnare dal bordo
            this.draw(newX, newY);
        }
        
    }
    
    stopDrawing():void {
        this._isDrawing = false;
        this._context.closePath();
    }
}