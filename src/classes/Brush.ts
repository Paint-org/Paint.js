/// <reference path="../libs/jquery/jquery.d.ts" />

export class Brush {
    
    private $ : JQueryStatic;
    
    constructor($ : JQueryStatic) {
        this.$ = $;
    }
    
    get width():number {
        return 3;
    }
    
    get color():string {
        return "#000000";
    }
}