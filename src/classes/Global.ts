/// <reference path="../libs/jquery/jquery.d.ts" />

import color = require('./Color');
import paper = require('./Paper');
import barManager = require('./BarManager');
import extensionManager = require('./ExtensionManager');

/**
 * This class contains a reference to most of the global
 * objects within the application.
 */
export class Paint {

    private _$: JQueryStatic;

    public document: Document;

    /** Insieme di tutte le estensioni caricate */
    private extensions: { [index: string]: any; } = {};
    /** Sottoinsieme di 'extensions' che contiene solo le estensioni di tipo Tool */
    private tools: { [index: string]: any; } = {};

    /** Current Paper object (the one at the base of the level hierarchy) */
    public currentPaper: paper.Paper;

    /** Bar Manager */
    public barManager: barManager.BarManager;

    /** Extension Manager */
    public extensionManager: extensionManager.ExtensionManager;

    /** Current colors */
    public _primaryColor: color.Color;
    public _secondaryColor: color.Color;
    public _toolSize: number;
    public File;
    public FileList;
    public menu = { File: null, Help: null };

    private _currentTool: any = null;

    constructor($: JQueryStatic, document: Document) {
        this._$ = $;
        this.document = document;

        this.currentPaper = new paper.Paper(this, $('#paper')[0]);

        this.barManager = new barManager.BarManager(this);
        this.extensionManager = new extensionManager.ExtensionManager(this);

        this._primaryColor = color.Color.Black;
        this._secondaryColor = color.Color.White;
    }

    get $(): JQueryStatic {
        return this._$;
    }

    registerExtension(instance: any) {
        this.extensions[instance.EXTENSION_NAME] = instance;
    }

    registerTool(instance: any) {
        this.tools[instance.EXTENSION_NAME] = instance;
    }

    set primaryColor(value: color.Color) {
        this._primaryColor = value;

        this.forEachExtension(function (ext) {
            if (ext.onPrimaryColorChanged) {
                ext.onPrimaryColorChanged();
            }
        });
    }

    get primaryColor() {
        return this._primaryColor;
    }

    set secondaryColor(value: color.Color) {
        this._secondaryColor = value;

        this.forEachExtension(function (ext) {
            if (ext.onSecondaryColorChanged) {
                ext.onSecondaryColorChanged();
            }
        });
    }

    get secondaryColor() {
        return this._secondaryColor;
    }

    set toolSize(value: number) {
        this._toolSize = value;
        this.forEachExtension(function (ext) {
            if (ext.onToolSizeChanged) {
                ext.onToolSizeChanged();
            }
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
    setCurrentTool(tool: any, idElement: string) {
        /* Set new tool and call Activated() and Deactivated() if tool listen these events */
        if (this._currentTool !== null && this._currentTool.deactivated) {
            this._currentTool.deactivated();
        }

        this._currentTool = tool;

        if (this._currentTool.activated) {
            this._currentTool.activated(idElement);
        }
    }

    get currentTool(): any {
        return this._currentTool;
    }

    public forEachExtension(callback: (ext: any) => void) {
        for (var ext in this.extensions) {
            if (this.extensions.hasOwnProperty(ext)) {
                callback(this.extensions[ext]);
            }
        }
    }

    public refreshMenu(): void {
        if (process.platform === "win32") {
            var gui = global.window.nwDispatcher.requireNwGui();
            var oldmenu = gui.Window.get().menu;
            oldmenu.append(this.menu.Help);
            oldmenu.removeAt(oldmenu.items.length - 1);
            gui.Window.get().menu = oldmenu;
        }
    }
}