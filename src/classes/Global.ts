/// <reference path="../libs/jquery/jquery.d.ts" />

import color = require('./Color');
import paper = require('./Paper');
import tool = require('./Tool');
import extension = require('./Extension');
import barManager = require('./BarManager');
import extensionManager = require('./ExtensionManager');

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
    
    /** Bar Manager */
    public barManager : barManager.BarManager;
   
    /** Extension Manager */
    public extensionManager : extensionManager.ExtensionManager;
    
    /** Current colors */
    public _primaryColor : color.Color;
    public _secondaryColor : color.Color;
    public _toolSize : number;
    public File;
    public FileList;
    public menu = { File: null, Help: null };
        
    private _currentTool : tool.Tool = null;
    
    constructor($ : JQueryStatic) {
        this._$ = $;
        
        this.currentPaper = new paper.Paper(this, $('#paper')[0]);
        
        this.barManager = new barManager.BarManager(this);
        this.extensionManager = new extensionManager.ExtensionManager(this);
        
        this._primaryColor = color.Color.Black;
        this._secondaryColor = color.Color.White;
    }
    
    get $():JQueryStatic {
        return this._$;
    }
    
    registerExtension(instance : extension.Extension) {
        this.extensions[instance.EXTENSION_NAME] = instance;
    }
    
    registerTool(instance : tool.Tool) {
        this.tools[instance.EXTENSION_NAME] = instance;
    }
    
    set primaryColor(value : color.Color) {
        this._primaryColor = value;

        this.forEachExtension(function (ext) {
            ext.onPrimaryColorChanged();
        });
    }
    
    get primaryColor() {
        return this._primaryColor;
    }
    
    set secondaryColor(value : color.Color) {
        this._secondaryColor = value;
        this.forEachExtension(function (ext) {
            ext.onSecondaryColorChanged();
        });
    }

    get secondaryColor() {
        return this._secondaryColor;
    }
    
    set toolSize(value:number) {
        this._toolSize = value;
        this.forEachExtension(function (ext) {
            ext.onToolSizeChanged();
        });
    }
    
    get toolSize() {
        return this._toolSize;
    }
    
    /**
     * Change active Tool
     * \param tool the new tool to be activated
     * \param idElement the element that caused tool activation
     */
    setCurrentTool(tool : tool.Tool, idElement : string) {
        if (this._currentTool !== null) {
            this._currentTool.deactivated();
        }
        
        this._currentTool = tool;
        tool.activated(idElement);
    }
    
    get currentTool() : tool.Tool {
        return this._currentTool;
    }

    private forEachExtension(callback: (ext:extension.Extension) => void) {
        for (var ext in this.extensions) {
            if (this.extensions.hasOwnProperty(ext)) {
                callback(this.extensions[ext]);
            }
        }
    }
}