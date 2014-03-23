/// <reference path="../libs/jquery/jquery.d.ts" />

import pen = require('./Pen');
import brush = require('./Brush');
import paper = require('./Paper');

export class Paint {
    
    private $ : JQueryStatic;
    
    public brushes : brush.Brushes;
    public pens : pen.Pens;
    
    public currentPaper : paper.Paper;
    public currentPen : pen.Pen;
    
    constructor($ : JQueryStatic) {
        this.$ = $;
        
        // Classe contenente brush principali
        this.brushes = new brush.Brushes();
        this.pens = new pen.Pens(this);
        
        // Penna settata come brush di default
        this.currentPen = this.pens.NormalPen;
        this.currentPaper = new paper.Paper($);
    }
     
}