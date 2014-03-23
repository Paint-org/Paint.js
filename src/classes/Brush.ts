/// <reference path="../libs/jquery/jquery.d.ts" />

export class Brush {
    
    private $ : JQueryStatic;
    private _width = 1;
    private _color = "#000000";
    
    constructor($ : JQueryStatic, width : any, color : any) {
        this.$ = $;
        
        this._width = (typeof(width) === 'number') ? width : 3;  
        this._color = (typeof(color) === 'string') ? color : "#000000";
    }
    
    get width():number {
        return this._width;
    }
    set width(value:number) {
        this._width = value;
    }
    
    get color():string {
        return this._color;
    }
    set color(value:string) {
        this._color = value;
    }
}

export class Brushes {

    private _pen : Brush;
    private _rubber : Brush;

    constructor($ : JQueryStatic) {
        this._pen = new Brush($, 3, "#000000");
        this._rubber = new Brush($, 10, "#ffffff"); 
    }
    
    get Rubber():Brush {
        return this._rubber;
    }
    
    get Pen():Brush {
        return this._pen;
    }
}