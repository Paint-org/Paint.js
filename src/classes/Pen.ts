import brush = require('./Brush');
import global = require('./Global');

/**
 * Represents the settings used to draw on the canvas, for example
 * the width (and the brush) of the stroke.
 */
export class Pen {
 
    private _brush : brush.Brush;
    private _width : number;

    constructor(brush : brush.Brush, width : number) {
        this._brush = brush;
        this._width = width;
    }
    
    get width():number {
        return this._width;
    }
    set width(value:number) {
        this._width = value;
    }
    
    get brush():brush.Brush {
        return this._brush;
    }
    set brush(value:brush.Brush) {
        this._brush = value;
    }
}

/**
 * A set of standard Pens.
 */
export class Pens {

    private _paint : global.Paint;
    private _normalPen : Pen;
    private _rubber : Pen;
    
    constructor(paint : global.Paint) {
        this._paint = paint;
        
        this._normalPen = new Pen(paint.brushes.Black, 3);
        this._rubber = new Pen(paint.brushes.White, 10);
    }
    
    get NormalPen():Pen {
        return this._normalPen;    
    }
    
    get Rubber():Pen {
        return this._rubber;
    }
}