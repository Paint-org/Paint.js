/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import color = require('./classes/Color');
import glob = require('./classes/Global');
import pt = require('./classes/Point');
import tool = require('./classes/Tools/Tool');
import toolPen = require('./classes/Tools/Pen');
import toolEraser = require('./classes/Tools/Eraser');

declare var paint:glob.Paint;

$(document).ready(function() {
   
    // Initialize global object containing Paper and Brush up to now
    paint = new glob.Paint($);
    paint.document = document;
    
    // Set event listener on Paper
    attachPaperEvents();
    
    $("#toolColor1").change(function(){
        paint.primaryColor = new color.Color($(this).val());
    }).change();
    
    $("#toolColor2").change(function(){
        paint.secondaryColor = new color.Color($(this).val());
    }).change();
    
    $("#toolSize").change(function(){
        paint.toolSize = parseInt($(this).val());
    }).change();
    
    preventWorkspaceScrollOnDrag();
    
    // Registra il tool Pen
    paint.tools[toolPen.Pen.TOOL_NAME] = new toolPen.Pen(paint);
    paint.tools[toolPen.Pen.TOOL_NAME].init();
    
    // Registra il tool Eraser
    paint.tools[toolEraser.Eraser.TOOL_NAME] = new toolEraser.Eraser(paint);
    paint.tools[toolEraser.Eraser.TOOL_NAME].init();
    
    paint.currentTool = paint.tools[toolPen.Pen.TOOL_NAME];
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
        }
    })
    
    $("#paperWrapper").width($("#paper").attr("width"));
    $("#paperWrapper").height($("#paper").attr("height"));
    $("#paperWrapper").resize(function() {
        $("#paper").attr("width", $(this).width());
        $("#paper").attr("height", $(this).height());
        $("#pageDimensionX").text($("#paper").width());
        $("#pageDimensionY").text($("#paper").height()); 
        
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
            $("#cursorPositionX").text(ev.offsetX);
            $("#cursorPositionY").text(ev.offsetY);
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