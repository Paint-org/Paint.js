/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import pen = require('./classes/Pen');
import brush = require('./classes/Brush');
import glob = require('./classes/Global');

declare var paint:glob.Paint;

$(document).ready(function() {
   
    // Initialize global object containing Paper and Brush up to now
    paint = new glob.Paint($);
       
    // Initialize resize handles
    $("#paperWrapper").resizable({
        handles: {
            'e': '#egrip',
            'se': '#segrip',
            's': '#sgrip'
        }
    });
    
    $("#paperWrapper").width($("#paper").attr("width"));
    $("#paperWrapper").height($("#paper").attr("height"));
    $("#paperWrapper").resize(function() {
        $("#paper").attr("width", $(this).width());
        $("#paper").attr("height", $(this).height());
    });
    
    // Set event listener on Paper
    attachPaperEvents();
    // Set event listener on buttons
    attachButtonEvents();
    
});

/**
 * Set event handler on canvas
 */
function attachPaperEvents() {
    // Load context
    var canvas = paint.currentPaper.canvas;
    
    $("#cursorPosition").hide();

    $(canvas).mousedown(function() {
        paint.currentPaper.startDrawing();
    });
    
    $(canvas).mouseenter(function(ev) {
        $("#cursorPosition").show();
    });
    
    $(document).mouseenter(function(ev) {
        if(paint.currentPaper.isDrawing()) {
            console.log("document-mouseenter");
            paint.currentPaper.stopDrawing();
            paint.currentPaper.startDrawing();
            var coord = paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
            //paint.currentPaper.drawFromEdge(ev.pageX, ev.pageY);
            paint.currentPaper.draw(coord.x, coord.y);
        }
    });
    
    $(document).mousemove(function(ev) {
        //console.log("document-mousemove");
        var coord = paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        paint.currentPaper.draw(coord.x, coord.y);
        $("#cursorPositionX").text(coord.x);
        $("#cursorPositionY").text(coord.y);
    });
    
    $(document).mouseleave(function(ev) {
        console.log("document-mouseleave");
        var coord = paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        paint.currentPaper.draw(coord.x, coord.y);
    });
    
    $(canvas).mouseleave(function(ev) {
        $("#cursorPosition").hide();
    });
    
    $(document).mouseup(function() {
        paint.currentPaper.stopDrawing();
    });
}

/**
 * Set event handler on buttons
 */
function attachButtonEvents() {
    
    // Initialize buttons
    $("#btnPen").click(function() {
        paint.currentPen = new pen.Pen(
            new brush.Brush($("#penColor1").val()),
            parseInt($("#penSize").val())
        );
    });
    
    $("#btnEraser").click(function() {
        paint.currentPen = new pen.Pen(
            new brush.Brush($("#penColor2").val()),
            parseInt($("#penSize").val())
        );
    });
}