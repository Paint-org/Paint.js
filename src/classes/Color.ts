/// <reference path="../libs/jquery/jquery.d.ts" />

export class Color {
    
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

    toHex() : string {
        return this._color;
    }
}

/**
 * A set of Brushes.
 */
export class Colors {

    private _black : Color;
    private _white : Color;

    constructor() {
        this._black = new Color("#000000");
        this._white = new Color("#ffffff"); 
    }
    
    get White():Color {
        return this._white;
    }
    
    get Black():Color {
        return this._black;
    }
}