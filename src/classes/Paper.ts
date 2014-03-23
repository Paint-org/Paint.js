/// <reference path="../libs/jquery/jquery.d.ts" />

export class Paper {
    
    private $ : JQueryStatic;
    private context : CanvasRenderingContext2D;
    
    public canvas : HTMLCanvasElement;
    
    
    constructor($ : JQueryStatic) {
        this.$ = $;
        
        this.canvas = <HTMLCanvasElement> $('#paper')[0];
        this.context = this.canvas.getContext('2d');
    }
    
    getContext():CanvasRenderingContext2D {

        return this.context;
    }
}