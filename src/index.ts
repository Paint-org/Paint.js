/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import pen = require('./classes/Pen');
import brush = require('./classes/Brush');
import global = require('./classes/Global');

declare var paint:global.Paint;

$(document).ready(function() {
   
    // Initialize global object containing Paper and Brush up to now
    paint = new global.Paint($);
       
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
    
    
    // Load context
    var paper = paint.currentPaper.canvas;

    $(paper).mousedown(function() {
        paint.currentPaper.startDrawing();
    });
    
    $("body").mousemove(function(ev) {
        paint.currentPaper.draw(ev);    
    });
    
    $("body").mouseup(function() {
        paint.currentPaper.stopDrawing();
    });
    
    
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