/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

// node-webkit requires
var gui = require('nw.gui');
var paint: Paint.Global;

declare var File;
declare var FileList;

$(document).ready(function() {

    // Apply runtime changes to the style
    tweakCSS();

    // Initialize global object containing Paper and Brush up to now
    paint = new Paint.Global($, document);
    paint.File = File;
    paint.FileList = FileList;

    // Set event listener on Paper
    attachPaperEvents();
    
    // Set event listener to prevent auto scroll while drawing
    preventWorkspaceScrollOnDrag();
    
    // Create Application Menu
    createMenu();
    
    // Load Extensions and Tools
    paint.extensionManager.addExtensions(function () {

        // Set default tool
        var pen = paint.getTool("com.paintjs.Pen");
        if (pen !== null) {
            paint.setCurrentTool(pen, null);
        }

    });
});

/**
 * Apply runtime changes to the style
 */
function tweakCSS() {
    if (process.platform === "win32") {
        var el = $("html,body");
        el.css("font-family", "Segoe UI, Helvetica, arial, freesans, clean, sans-serif");
        el.css("font-size", "12px");
    }
}

/**
 * Set event handler on canvas
 */
function attachPaperEvents() {
    var paper = paint.currentPaper.paperElement;
    
    // Initialize resize handles
    var savedCanvas : HTMLCanvasElement;
    $("#paperWrapper").resizable({
        handles: {
            'e': '#egrip',
            'se': '#segrip',
            's': '#sgrip'
        },

        // Save canvas content before resizing
        start: function (event, ui) {
            paint.currentPaper.onResizeStart();
        },

        stop: function (event, ui) {
            // Restore default cursor
            $("body").css('cursor', '');
            paint.currentPaper.onResizeEnd();
        }
    });
    
    paint.currentPaper.Zoom = 1.0;
  
    $("#paperWrapper").resize(function() {
        $(paper).css("width", $(this).width());
        $(paper).css("height", $(this).height());
        
        paint.currentPaper.onResize();
    });
}

/**
 * Evita scroll derivante dal dragging del mouse
 */
function preventWorkspaceScrollOnDrag() {
    var scrollX = 0, scrollY = 0, preventScroll = false;
    $("#paperWrapper").mousedown(function () {
        scrollX = $("#workspace").scrollLeft();
        scrollY = $("#workspace").scrollTop();
        preventScroll = true;
    });
    $("#workspace").scroll(function () {
        if (preventScroll) {
            $(this).scrollLeft(scrollX);
            $(this).scrollTop(scrollY);
        }
    });
    $(document).mouseup(function () {
        preventScroll = false;
    });
}

function createMenu() {
    var menu = new gui.Menu({ type: 'menubar' });

    var mnuFile = new gui.MenuItem({ label: 'File', submenu: new gui.Menu() });
    menu.append(mnuFile);
    paint.menu.File = mnuFile;

    var mnuFile_Exit = new gui.MenuItem({ label: 'Exit' });
    mnuFile_Exit.click = function () {
        gui.Window.get().close();
    };
    mnuFile.submenu.append(mnuFile_Exit);


    var mnuHelp = new gui.MenuItem({ label: 'Help', submenu: new gui.Menu() });
    menu.append(mnuHelp);
    paint.menu.Help = mnuHelp;

    var mnuHelp_Debug = new gui.MenuItem({ label: 'Debug' });
    mnuHelp_Debug.click = () => gui.Window.get().showDevTools();
    mnuHelp.submenu.append(mnuHelp_Debug);

    var mnuHelp_About = new gui.MenuItem({ label: 'About' });
    mnuHelp_About.click = () => window.open("about.html", "", "width=500,height=400");
    mnuHelp.submenu.append(mnuHelp_About);

    gui.Window.get().menu = menu;
}