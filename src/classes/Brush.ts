/// <reference path="../libs/jquery/jquery.d.ts" />

export class Brush {
    
    private _color;
    
    constructor(color : string) {
        this._color = color;
    }
    
    get color():string {
        return this._color;
    }
    set color(value:string) {
        this._color = value;
    }
}

export class Brushes {

    private _black : Brush;
    private _white : Brush;

    constructor() {
        this._black = new Brush("#000000");
        this._white = new Brush("#ffffff"); 
    }
    
    get White():Brush {
        return this._white;
    }
    
    get Black():Brush {
        return this._black;
    }
}