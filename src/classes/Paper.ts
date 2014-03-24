/// <reference path="../libs/jquery/jquery.d.ts" />

import global = require('./Global');

export class Paper {
    
    private _paint : global.Paint;
    private _context : CanvasRenderingContext2D;
    
    private _mousedown = false;
    private _started = false;
    
    public canvas : HTMLCanvasElement;
    
    
    constructor(paint : global.Paint) {

        this._paint = paint;
        
        this.canvas = <HTMLCanvasElement> this._paint.$('#paper')[0];
        this._context = this.canvas.getContext('2d');
    }
    
    getContext():CanvasRenderingContext2D {
        return this._context;
    }
    
    startDrawing():void {
        this._mousedown = true;
        this._started = false;
        
        this._context.lineWidth = this._paint.currentPen.width;
        this._context.strokeStyle = this._paint.currentPen.brush.color;
    }
    
    draw(ev : JQueryMouseEventObject):void {
        if (this._mousedown) {
            var x, y;
            
            var parentOffset = this._paint.$(this.canvas).parent().offset();
            
            x = ev.pageX - parentOffset.left;
            y = ev.pageY - parentOffset.top;
        
            if (!this._started) {
              this._context.moveTo(x, y);
              this._context.beginPath();
              this._started = true;
                
            } else {
              this._context.lineTo(x, y);
              this._context.stroke();
            }
        }
    }
    
    stopDrawing():void {
        this._mousedown = false;
        this._context.closePath();
    }
}