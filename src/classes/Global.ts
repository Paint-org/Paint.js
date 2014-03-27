/// <reference path="../libs/jquery/jquery.d.ts" />

import color = require('./Color');
import paper = require('./Paper');
import tool = require('./Extensions/Tools/Tool');

/**
 * This class contains a reference to most of the global
 * objects within the application.
 */
export class Paint {
    
    private _$ : JQueryStatic;
    
    public document : Document;
    public tools : { [index: string]: tool.Tool; } = {};
    
    public currentPaper : paper.Paper;
    public primaryColor : color.Color;
    public secondaryColor : color.Color;
    public toolSize : number;
    
    private _currentTool : tool.Tool = null;
    
    constructor($ : JQueryStatic) {
        this._$ = $;
        
        this.currentPaper = new paper.Paper(this);
        this.primaryColor = color.Colors.Black;
        this.secondaryColor = color.Colors.White;
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