/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import color = require('./classes/Color');
import glob = require('./classes/Global');
import pt = require('./classes/Point');

// node-webkit requires
var gui = require('nw.gui');
var paint:glob.Paint;

declare var File;
declare var FileList;

$(document).ready(function() {
   
    // Initialize global object containing Paper and Brush up to now
    paint = new glob.Paint($);
    paint.document = document;
    paint.File = File;
    paint.FileList = FileList;

    // Set event listener on Paper
    attachPaperEvents();
    
    // Set event listener to prevent auto scroll while drawing
    preventWorkspaceScrollOnDrag();
    
    // Create Application Menu
    createMenu();
    
    // Load Extensions and Tools
    paint.extensionManager.addExtensions();
});

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
        start: function(event, ui) {
            paint.currentPaper.onResizeStart();
        },
        
        stop: function(event, ui) {
            // Restore default cursor
            $("body").css('cursor', '');
            paint.currentPaper.onResizeEnd();
        }
    })
    
    paint.currentPaper.Zoom = 1.0;
  
    $("#paperWrapper").resize(function() {
        $(paper).css("width", $(this).width());
        $(paper).css("height", $(this).height());
        
        paint.currentPaper.onResize();
    });
    
    $("#cursorPosition").hide();
    
    $(paper).mouseenter(function(ev) {
        $("#cursorPosition").show();
    });
    
    $(document).mousemove(function(ev) {
        var cord = paint.currentPaper.pageXYtoPaperXY(ev.pageX, ev.pageY);
        
        if (ev.target === paper) {
           $("#cursorPositionX").text(cord.X);
           $("#cursorPositionY").text(cord.Y);
        }
    });
    
    $(paper).mouseleave(function(ev) {
        $("#cursorPosition").hide();
    });
}

/**
 * Evita scroll derivante dal dragging del mouse
 */
function preventWorkspaceScrollOnDrag() {
    var scrollX = 0, scrollY = 0, preventScroll = false;
    $("#paperWrapper").mousedown(function(){
        scrollX = $("#workspace").scrollLeft();
        scrollY = $("#workspace").scrollTop();
        preventScroll = true;
    });
    $("#workspace").scroll(function(){
        if(preventScroll) {
            $(this).scrollLeft(scrollX);
            $(this).scrollTop(scrollY);
        }
    });
    $(document).mouseup(function(){
        preventScroll = false;
    });
}

function createMenu()
{
    var menu = new gui.Menu({ type: 'menubar' });
    
    var mnuFile = new gui.MenuItem({ label: 'File', submenu: new gui.Menu() });
    menu.append(mnuFile);

    gui.Window.get().menu = menu;
}