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
    
    attachPaperEvents();
    
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
});


function attachPaperEvents() {
    // Load context
    var canvas = paint.currentPaper.canvas;
    
    $("#cursorPosition").hide();

    $(canvas).mousedown(function() {
        paint.currentPaper.startDrawing();
    });
    
    $(canvas).mouseenter(function(ev) {
        $("#cursorPosition").show();
        if(paint.currentPaper.isDrawing()) {
            paint.currentPaper.stopDrawing();
            paint.currentPaper.startDrawing();
            paint.currentPaper.drawFromEdge(ev.offsetX, ev.offsetY);
            paint.currentPaper.draw(ev.offsetX, ev.offsetY);
        }
    });
    
    $(canvas).mousemove(function(ev) {
        paint.currentPaper.draw(ev.offsetX, ev.offsetY);
        $("#cursorPositionX").text(ev.offsetX);
        $("#cursorPositionY").text(ev.offsetY);
    });
    
    $(canvas).mouseleave(function(ev) {
        $("#cursorPosition").hide();
        paint.currentPaper.draw(ev.offsetX, ev.offsetY);
    });
    
    $("body").mouseup(function() {
        paint.currentPaper.stopDrawing();
    });
}