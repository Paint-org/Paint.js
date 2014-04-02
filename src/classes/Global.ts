/// <reference path="../libs/jquery/jquery.d.ts" />

import color = require('./Color');
import paper = require('./Paper');
import tool = require('./Tool');
import extension = require('./Extension');

/**
 * This class contains a reference to most of the global
 * objects within the application.
 */
export class Paint {
    
    private _$ : JQueryStatic;
    
    public document : Document;
    
    /** Insieme di tutte le estensioni caricate */
    public extensions : { [index: string]: extension.Extension; } = {};
    /** Sottoinsieme di 'extensions' che contiene solo le estensioni di tipo Tool */
    public tools : { [index: string]: tool.Tool; } = {};
    
    /** Current Paper object (the one at the base of the level hierarchy) */
    public currentPaper : paper.Paper;
    public primaryColor : color.Color;
    public secondaryColor : color.Color;
    public toolSize : number;
    public File;
    public FileList;
        
    private _currentTool : tool.Tool = null;
    
    constructor($ : JQueryStatic) {
        this._$ = $;
        
        this.currentPaper = new paper.Paper(this, $('#paper')[0]);
        this.primaryColor = color.Color.Black;
        this.secondaryColor = color.Color.White;
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