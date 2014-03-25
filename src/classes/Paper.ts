/// <reference path="../libs/jquery/jquery.d.ts" />

import glob = require('./Global');
import pt = require('./Point');

export class Paper {
    
    private _paint : glob.Paint;
    private _context : CanvasRenderingContext2D;
    
    private _isDrawing = false;
    private _started = false;
    
    private _lastPoint : pt.Point;
    
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
        return new pt.Point(x - this._paint.$(this.canvas).parent().offset().left,
                            y - this._paint.$(this.canvas).parent().offset().top);
    }
    
    isDrawing():boolean {
        return this._isDrawing;
    }
    
    startDrawing():void {
        
        // if already drawing, then draw from _lastPoint to make
        // line continuos between mousemove point in canvas
        // and the border 
        if (this._isDrawing) {
            this._context.moveTo(this._lastPoint.X, this._lastPoint.Y);
            this._context.beginPath();
            this._context.lineTo(this._lastPoint.X, this._lastPoint.Y);
            this._started = true;
            this._context.lineWidth = this._paint.currentPen.width;
            this._context.strokeStyle = this._paint.currentPen.brush.color;        
        } else {
            this._isDrawing = true;
            this._started = false;
            
            this._context.lineWidth = this._paint.currentPen.width;
            this._context.strokeStyle = this._paint.currentPen.brush.color;
        }
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
}