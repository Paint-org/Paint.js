/// <reference path="../libs/jquery/jquery.d.ts" />

import pen = require('./Pen');
import brush = require('./Brush');
import paper = require('./Paper');
import tool = require('./Tools/Tool');

/**
 * This class contains a reference to most of the global
 * objects within the application.
 */
export class Paint {
    
    private _$ : JQueryStatic;
    
    public document : Document;
    public tools : { [index: string]: tool.Tool; } = {};
    
    public brushes : brush.Brushes;
    public pens : pen.Pens;
    
    public currentPaper : paper.Paper;
    public currentPen : pen.Pen;
    
    private _currentTool : tool.Tool = null;
    
    constructor($ : JQueryStatic) {
        this._$ = $;
        
        // Classe contenente brush principali
        this.brushes = new brush.Brushes();
        this.pens = new pen.Pens(this);
        
        // Penna settata come brush di default
        this.currentPen = this.pens.NormalPen;
        this.currentPaper = new paper.Paper(this);
    }
    
    get $():JQueryStatic {
        return this._$;
    }
    
    set currentTool(tool:tool.Tool) {
        if(this._currentTool !== null)
            this._currentTool.deactivated();
        
        this._currentTool = tool;
        tool.activated();
    }
}