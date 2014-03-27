import glob = require('../../Global');
import color = require('../../Color');
import tool = require('./Tool');
   
export class Pen extends tool.Tool
{
    static TOOL_NAME : string = "Pen";
    paint : glob.Paint;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = paint.$;
        $("#topBar").append('<button id="btnPen">Pen</button>');
        
        var curInstance = this;
        $("#btnPen").click(function() {
            paint.currentTool = curInstance;
        });
    }
    
    activated() {
        super.activated();
        
        console.log("Registrazione del tool Pen");
        
        var paint = this.paint;
        var $ = paint.$;
        var document = paint.document;
        
        
        // Load context
        var canvas = paint.currentPaper.canvas;
    
        $(canvas).on("mousedown", $.proxy(this.canvas_mousedown, this));
        $(canvas).on("mouseenter", $.proxy(this.canvas_mouseenter, this));
        $(document).on("mousemove", $.proxy(this.document_mousemove, this));
        $(canvas).on("mouseleave", $.proxy(this.canvas_mouseleave, this));
        $(document).on("mouseup", $.proxy(this.document_mouseup, this));
        
    }
    
    inkColor() : color.Color {
        return this.paint.primaryColor;
    }
    
    deactivated() {
        var $ = this.paint.$;
        var document = this.paint.document;
        var canvas = this.paint.currentPaper.canvas;
        
        $(canvas).off("mousedown", this.canvas_mousedown);
        $(canvas).off("mouseenter", this.canvas_mouseenter);
        $(document).off("mousemove", this.document_mousemove);
        $(canvas).off("mouseleave", this.canvas_mouseleave);
        $(document).off("mouseup", this.document_mouseup);
    }
    
    private canvas_mousedown(ev) {
        this.paint.currentPaper.startDrawing(this.inkColor(), this.paint.toolSize);
    }
    
    private canvas_mouseenter(ev) {
        if (this.paint.currentPaper.isDrawing())
            this.paint.currentPaper.startDrawing(this.inkColor(), this.paint.toolSize);
    }
    
    private document_mousemove(ev) {
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.recordOuterPoint(cord);
        
        if (ev.target === this.paint.currentPaper.canvas) {
            this.paint.currentPaper.draw(ev.offsetX, ev.offsetY);
        }
    }
    
    private canvas_mouseleave(ev) {
        var point = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.exitFromPaper(point);
    }
        
    private document_mouseup(ev) {
        this.paint.currentPaper.stopDrawing();
    }
}