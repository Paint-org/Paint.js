import color = require('./Color');
import glob = require('./Global');

/**
 * Represents the settings used to draw on the canvas, for example
 * the width (and the brush) of the stroke.
 */
export class Pen {
 
    private _color : color.Color;
    private _width : number;

    constructor(color : color.Color, width : number) {
        this._color = color;
        this._width = width;
    }
    
    get width():number {
        return this._width;
    }
    set width(value:number) {
        this._width = value;
    }
    
    get color():color.Color {
        return this._color;
    }
    set color(value:color.Color) {
        this._color = value;
    }
}

/**
 * A set of standard Pens.
 */
export class Pens {

    private _paint : glob.Paint;
    private _normalPen : Pen;
    private _rubber : Pen;
    
    constructor(paint : glob.Paint) {
        this._paint = paint;
        
        this._normalPen = new Pen(paint.colors.Black, 3);
        this._rubber = new Pen(paint.colors.White, 10);
    }
    
    get NormalPen():Pen {
        return this._normalPen;    
    }
    
    get Rubber():Pen {
        return this._rubber;
    }
}