/// <reference path="../libs/jquery/jquery.d.ts" />

import brush = require('./Brush');
import paper = require('./Paper');

export class Paint {
    
    private $ : JQueryStatic;
    
    public brushes : brush.Brushes;
    
    public currentPaper : paper.Paper;
    public currentBrush : brush.Brush; 
    
    constructor($ : JQueryStatic) {
        this.$ = $;
        
        // Classe contenente brush principali
        this.brushes = new brush.Brushes($);
        
        // Penna settata come brush di default
        this.currentBrush = this.brushes.Pen;
        this.currentPaper = new paper.Paper($);
    }
     
}