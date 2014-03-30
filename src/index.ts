/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import color = require('./classes/Color');
import glob = require('./classes/Global');
import pt = require('./classes/Point');
import tool = require('./classes/Extensions/Tools/Tool');
import extension = require('./classes/Extensions/Extension');
import toolPen = require('./classes/Extensions/Tools/DrawingTools/Pen');
import toolEraser = require('./classes/Extensions/Tools/DrawingTools/Eraser');
import toolBrush = require('./classes/Extensions/Tools/DrawingTools/Brush');
import extColorChooser = require('./classes/Extensions/ColorChooser');
import extSizeChooser = require('./classes/Extensions/SizeChooser');
import extZoom = require('./classes/Extensions/Zoom');

declare var paint:glob.Paint;

var saveFileDialog = $('<input id="saveAs" type="file" nwsaveas accept=".png" />')[0];

$(document).ready(function() {
   
    // Initialize global object containing Paper and Brush up to now
    paint = new glob.Paint($);
    paint.document = document;

    // Set event listener on Paper
    attachPaperEvents();
    
    // Set event listener to prevent auto scroll while drawing
    preventWorkspaceScrollOnDrag();
    
    createMenu();
    
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
        paint.currentPaper.getContext().drawImage(savedCanvas, 0, 0);
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

function chooseFile(dialog, callback) {
    var chooser = $(dialog);
    //chooser.val("\|/?*");
    
    var change = function(evt) {
        console.log("called " + $(this).val());
        $(this).off("change", change);
        callback($(this).val());
    }
    
    chooser.on("change", change);

    chooser.trigger('click');
}

function createMenu()
{
    $("#btnSave").click(function(){
        chooseFile(saveFileDialog, function(file) {
            if(file != "") {
                paint.currentPaper.save(file, function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        });

    });  
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
}