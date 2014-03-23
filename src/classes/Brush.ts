/// <reference path="../libs/jquery/jquery.d.ts" />

export class Brush {
    
    private $ : JQueryStatic;
    private _width = 1;
    private _color = "#000000";
    
    constructor($ : JQueryStatic) {
        this.$ = $;
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