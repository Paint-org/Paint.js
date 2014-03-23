/// <reference path="../libs/jquery/jquery.d.ts" />

import brush = require('./Brush');
import paper = require('./Paper');

export class Paint {
    
    private $ : JQueryStatic;

    public currentPaper : paper.Paper;
    public currentBrush : brush.Brush; 
    
    constructor($ : JQueryStatic) {
        this.$ = $;
        
        this.currentBrush = new brush.Brush($);
        this.currentPaper = new paper.Paper($);
    }
     
}