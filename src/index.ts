/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/jqueryui/jqueryui.d.ts" />

import brush = require('./classes/Brush');

$(document).ready(function() { 
    
    
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
    
    
    var paper = <HTMLCanvasElement> $("#paper")[0];
    var context = paper.getContext('2d');
    
    
    // Load the default brush
    var currentBrush = new brush.Brush();
    context.lineWidth = currentBrush.width;
    context.strokeStyle = currentBrush.color;
    
    
    var mousedown = false;
    var started = false;
    $(paper).mousedown(function() {
        mousedown = true;
        started = false;
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
    
});