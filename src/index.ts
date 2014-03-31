/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import color = require('./classes/Color');
import glob = require('./classes/Global');
import pt = require('./classes/Point');
import tool = require('./classes/Tool');
import extension = require('./classes/Extension');

import toolPen = require('./extensions/Pen/Pen');
import toolEraser = require('./extensions/Eraser/Eraser');
import toolBrush = require('./extensions/Brush/Brush');

import extColorChooser = require('./extensions/ColorChooser/ColorChooser');
import extSizeChooser = require('./extensions/SizeChooser/SizeChooser');
import extZoom = require('./extensions/Zoom/Zoom');
import extImageSaver = require('./extensions/ImageSaver/ImageSaver');

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
    loadExtensions();
        
});

/**
 * Set event handler on canvas
 */
function attachPaperEvents() {
    var canvas = paint.currentPaper.canvas;
    
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
            savedCanvas = document.createElement('canvas');
            savedCanvas.width = canvas.width;
            savedCanvas.height = canvas.height;
            savedCanvas.getContext('2d').drawImage(canvas, 0, 0);
        },
        
        stop: function(event, ui) {
            // Restore default cursor
            $("body").css('cursor', '');
        }
    })
    
    paint.currentPaper.Zoom = 1.0;
  
    $("#paperWrapper").resize(function() {
        $("#paper").attr("width", $(this).width() / paint.currentPaper.Zoom);
        $("#paper").attr("height", $(this).height() / paint.currentPaper.Zoom);
        $("#pageDimensionX").text($(canvas).width());
        $("#pageDimensionY").text($(canvas).height()); 
        
        // Reload canvas content
        paint.currentPaper.restoreImage(savedCanvas);
    });
    
    $("#cursorPosition").hide();
    
    $(canvas).mouseenter(function(ev) {
        $("#cursorPosition").show();
    });
    
    $(document).mousemove(function(ev) {
        var cord = paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        
        if (ev.target === canvas) {
           $("#cursorPositionX").text(cord.X);
           $("#cursorPositionY").text(cord.Y);
        }
    });
    
    $(canvas).mouseleave(function(ev) {
        $("#cursorPosition").hide();
    });
    
    $("#pageDimensionX").text($(canvas).width());
    $("#pageDimensionY").text($(canvas).height());
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
    // Registra il tool Pen
    paint.tools[toolPen.Pen.EXTENSION_NAME] = new toolPen.Pen(paint);
    paint.extensions[toolPen.Pen.EXTENSION_NAME] = paint.tools[toolPen.Pen.EXTENSION_NAME];
    paint.tools[toolPen.Pen.EXTENSION_NAME].init();
    
    // Registra il tool Eraser
    paint.tools[toolEraser.Eraser.EXTENSION_NAME] = new toolEraser.Eraser(paint);
    paint.extensions[toolEraser.Eraser.EXTENSION_NAME] = paint.tools[toolEraser.Eraser.EXTENSION_NAME];
    paint.tools[toolEraser.Eraser.EXTENSION_NAME].init();
    
    // Setta il tool Brush
    paint.tools[toolBrush.Brush.EXTENSION_NAME] = new toolBrush.Brush(paint);
    paint.extensions[toolBrush.Brush.EXTENSION_NAME] = paint.tools[toolBrush.Brush.EXTENSION_NAME];
    paint.tools[toolBrush.Brush.EXTENSION_NAME].init();    
    
    // Setta il tool corrente
    paint.currentTool = paint.tools[toolPen.Pen.EXTENSION_NAME];
    
    // Registra l'estensione ColorChooser per la scelta dei colori
    paint.extensions[extColorChooser.ColorChooser.EXTENSION_NAME] = new extColorChooser.ColorChooser(paint);
    paint.extensions[extColorChooser.ColorChooser.EXTENSION_NAME].init();
    
    // Registra l'estensione SizeChooser per la scelta della dimensione
    paint.extensions[extSizeChooser.SizeChooser.EXTENSION_NAME] = new extSizeChooser.SizeChooser(paint);
    paint.extensions[extSizeChooser.SizeChooser.EXTENSION_NAME].init();
    
    // Registra l'estensione Zoom
    paint.extensions[extZoom.Zoom.EXTENSION_NAME] = new extZoom.Zoom(paint);
    paint.extensions[extZoom.Zoom.EXTENSION_NAME].init();
    
    // Registra l'estensione ImageSaver
    paint.extensions[extImageSaver.ImageSaver.EXTENSION_NAME] = new extImageSaver.ImageSaver(paint);
    paint.extensions[extImageSaver.ImageSaver.EXTENSION_NAME].init();
}