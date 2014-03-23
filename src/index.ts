/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

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
    var paper = paint.currentPaper.canvas,
        context = paint.currentPaper.getContext();    
    
    var mousedown = false;
    var started = false;

    $(paper).mousedown(function() {
        mousedown = true;
        started = false;
        
        context.lineWidth = paint.currentPen.width;
        context.strokeStyle = paint.currentPen.brush.color;
    });
    
    $(paper).mousemove(function(ev) {
        if(mousedown) {
            var x, y;
            
            var parentOffset = $(this).parent().offset();
            
            x = ev.pageX - parentOffset.left;
            y = ev.pageY - parentOffset.top;
        
            if (!started) {
              context.moveTo(x, y);
              context.beginPath();
              started = true;
            } else {
              context.lineTo(x, y);
              context.stroke();
            }
        }
    
    });
    
    $("body").mouseup(function() {
        mousedown = false;
        context.closePath();
    });
    
    
    // Initialize buttons
    $("#btnPen").click(function() {
        paint.currentPen = paint.pens.NormalPen;
    });
    
    $("#btnEraser").click(function() {
        paint.currentPen = paint.pens.Rubber;
    });
});