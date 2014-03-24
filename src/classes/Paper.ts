/// <reference path="../libs/jquery/jquery.d.ts" />

import global = require('./Global');

export class Paper {
    
    private _paint : global.Paint;
    private context : CanvasRenderingContext2D;
    
    public canvas : HTMLCanvasElement;
    
    
    constructor(paint : global.Paint) {

        this._paint = paint;
        
        this.canvas = <HTMLCanvasElement> this._paint.$('#paper')[0];
        this.context = this.canvas.getContext('2d');
    }
    
    getContext():CanvasRenderingContext2D {
        return this.context;
    }
}