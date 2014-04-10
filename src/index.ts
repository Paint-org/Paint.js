/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import color = require('./classes/Color');
import glob = require('./classes/Global');
import pt = require('./classes/Point');
import tool = require('./classes/Tool');
import extension = require('./classes/Extension');
/*
import toolPencil = require('./extensions/Pencil/Pencil');
import toolPen = require('./extensions/Pen/Pen');
import toolEraser = require('./extensions/Eraser/Eraser');
import toolBrush = require('./extensions/Brush/Brush');
import toolShapeDrawer = require('./extensions/ShapeDrawer/ShapeDrawer');

import toolColorPicker = require('./extensions/ColorPicker/ColorPicker');

import extColorChooser = require('./extensions/ColorChooser/ColorChooser');
import extSizeChooser = require('./extensions/SizeChooser/SizeChooser');
import extZoom = require('./extensions/Zoom/Zoom');
import extImageSaver = require('./extensions/ImageSaver/ImageSaver');
import extPaperSize = require('./extensions/PaperSize/PaperSize');
*/
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
    //loadExtensions();
        
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

function loadExtensions() {
    /*
    var extensions : extension.Extension[] = [];
    var defaultTool : tool.Tool;
    
    // Registra il tool Pencil
    extensions.push(new toolPencil.Pencil(paint));
    
    // Registra il tool Pen
    defaultTool = new toolPen.Pen(paint);
    extensions.push(defaultTool);
    
    // Registra il tool Eraser
    extensions.push(new toolEraser.Eraser(paint));
    
    // Registra il tool Brush
    extensions.push(new toolBrush.Brush(paint));
    
    // Registra il tool Line
    extensions.push(new toolShapeDrawer.ShapeDrawer(paint));
    
    // Registra il tool ColorPicker
    extensions.push(new toolColorPicker.ColorPicker(paint));
    
    // Registra l'estensione ColorChooser per la scelta dei colori
    extensions.push(new extColorChooser.ColorChooser(paint));
    
    // Registra l'estensione SizeChooser per la scelta della dimensione
    extensions.push(new extSizeChooser.SizeChooser(paint));
    
    // Registra l'estensione PaperSize
    extensions.push(new extPaperSize.PaperSize(paint));
    
    // Registra l'estensione Zoom
    extensions.push(new extZoom.Zoom(paint));
    
    // Registra l'estensione ImageSaver
    extensions.push(new extImageSaver.ImageSaver(paint));
    
    
    extensions.forEach(function(extension){
        extension.init();
    });
    
    // Setta il tool corrente
    
    paint.setCurrentTool(defaultTool, null);
    */
}