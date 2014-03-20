/// <reference path="libs/node/node.d.ts" />
/// <reference path="libs/jquery/jquery.d.ts" />

$(document).ready(function() {
    
    var paper = <HTMLCanvasElement> $("#paper")[0];
    var context = paper.getContext('2d');
    
    var started = false;    
    $(paper).mousemove(function(ev) {
        var x, y;
        
        var parentOffset = $(this).parent().offset();
        
        x = ev.pageX - parentOffset.left;
        y = ev.pageY - parentOffset.top;
        
        if (!started) {
          context.beginPath();
          context.moveTo(x, y);
          started = true;
        } else {
          context.lineTo(x, y);
          context.stroke();
        }
    
    });
    
});