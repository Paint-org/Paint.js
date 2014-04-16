/// <reference path="../libs/jquery/jquery.d.ts" />

import glob = require('./Global');
import pt = require('./Point');
import color = require('./Color');
import paperLayer = require('./PaperLayer');
import colorMatrix = require('./ColorMatrix');

export class Paper {
    
    private _paint : glob.Paint;
    
    private _zoom : number = 1;
    private _layers : paperLayer.PaperLayer[] = [];
    private _paper : HTMLElement;
    private _savedCanvas : HTMLCanvasElement[] = [];
    
    constructor(paint : glob.Paint, element : HTMLElement) {

        this._paint = paint;
        this._paper = element;

        this.addLayer(color.Color.White);        
        this.setHandlers();
    }
    
    setHandlers() {
        var $ = this._paint.$,
            emitter = this._paint.eventEmitter;
        
        $(this._paper).on("click", $.proxy(function(ev){
            var cT = this._paint.currentTool;
            
            if (cT)
                emitter.triggerOnPaperClick(this.pageXYtoPaperXY(ev.pageX, ev.pageY), cT);
        }, this));

        $(this._paper).on("mousedown", $.proxy(function (ev) {
            if (this._paint.currentTool)
                emitter.triggerOnStartDrawing(this.pageXYtoPaperXY(ev.pageX, ev.pageY), this._paint.currentTool);
        }, this));
        
        $(this._paper).on("mouseenter", $.proxy(function(ev){
            emitter.triggerOnPaperMouseEnter(this.pageXYtoPaperXY(ev.pageX, ev.pageY), null);
        }, this));
        
        $(this._paper).on("mousemove", $.proxy(function(ev){
            emitter.triggerOnPaperMouseMove(this.pageXYtoPaperXY(ev.pageX, ev.pageY), null);
        }, this));
        
        $(this._paper).on("mouseleave", $.proxy(function(ev){
            emitter.triggerOnPaperMouseLeave(this.pageXYtoPaperXY(ev.pageX, ev.pageY), null);
        }, this));
        
        $(this._paint.document).on("mousemove", $.proxy(function(ev){
            var cT = this._paint.currentTool;
            
            if (cT)
                emitter.triggerOnDraw(this.pageXYtoPaperXY(ev.pageX, ev.pageY), cT);
        }, this));
        
        $(this._paint.document).on("mouseup", $.proxy(function(ev){
            var cT = this._paint.currentTool;
            
            if (cT)
                emitter.triggerOnStopDrawing(this.pageXYtoPaperXY(ev.pageX, ev.pageY), cT);
        }, this));
    }
    
    get paperElement() : HTMLElement {
        return this._paper;
    }
    
    get baseLayer() : paperLayer.PaperLayer {
        return this._layers[0];
    }
    
    get layers() : paperLayer.PaperLayer[] {
        return this._layers;
    }
    
    /**
     * Adds a new Paper on top of the current one.
     * This is NOT a Photoshop-style layer, but it's
     * an helper canvas used to draw temporary elements. 
     */
    addLayer(background:color.Color) : paperLayer.PaperLayer {
        var $ = this._paint.$;
        
        var newCanvas = $('<canvas />')
        newCanvas.css('position', 'absolute');
        newCanvas.css('top', 0);
        newCanvas.css('left', 0);
        newCanvas.css('pointer-events', 'none');
        
        var paper = $(this._paper);
        newCanvas.attr("width", paper.width() / this._zoom);
        newCanvas.attr("height", paper.height() / this._zoom);
        newCanvas.css('zoom', (this._zoom * 100) + '%');
        
        $('#paperWrapper').append(newCanvas);
        
        // Add the layer to the internal array
        var layer = new paperLayer.PaperLayer(this._paint, <HTMLCanvasElement>newCanvas[0], background);
        this._layers.push(layer);
        
        return layer;
    }
    
    /**
     * Removes a layer.
     */
    removeLayer(layer : paperLayer.PaperLayer) {
        if(layer == this.baseLayer)
            throw "Cannot remove the base layer";
        
        var $ = this._paint.$;
        $('#paperWrapper')[0].removeChild(layer.canvas);
        
        // Remove the layer from the internal array
        var id = this._layers.lastIndexOf(layer);
        this._layers.splice(id, 1);
    }
    
    pageXYtoPaperXY(x:number, y:number) : pt.Point {
        var offset = this._paint.$(this._paper).parent().offset();
        return new pt.Point(
          Math.round((x - offset.left) / this._zoom),
          Math.round((y - offset.top) / this._zoom)
        );
    }
    
    onResizeStart() {
        this._savedCanvas = [];
        
        for(var i = 0; i < this._layers.length; i++) {
            var layer = this._layers[i];
            
            var savedCanvas = this._paint.document.createElement('canvas');
            savedCanvas.width = layer.canvas.width;
            savedCanvas.height = layer.canvas.height;
            savedCanvas.getContext('2d').drawImage(layer.canvas, 0, 0);
            
            this._savedCanvas[i] = savedCanvas;
        }

        this._paint.eventEmitter.triggerOnResizeStart(null);
    }
    
    onResize() {
        var $ = this._paint.$;
        var paper = $(this._paper);
        var zoom = this._zoom;
        
        for(var i = 0; i < this._layers.length; i++) {
            var layer = this._layers[i];
            
            var l = $(layer.canvas);
            l.attr("width", paper.width() / zoom);
            l.attr("height", paper.height() / zoom);
            
            // Reload canvas content
            layer.restoreImage(this._savedCanvas[i]);
        };

        this._paint.eventEmitter.triggerOnResize(null);
    }
    
    onResizeEnd() {
        this._savedCanvas = [];
        this._paint.eventEmitter.triggerOnResizeEnd(null);
    }
    
    /**
     * Set canvas zoom factor (default = 1)
     */
    set Zoom(value:number) {

        var $ = this._paint.$;
        this._zoom = value;

        this._layers.forEach(function(layer) {
            $(layer.canvas).css('zoom', (value * 100) + '%');
        });
        
        var realWidth = this.baseLayer.canvas.width;
        var realHeight = this.baseLayer.canvas.height;
        
        var paper = $(this._paper);
        paper.width(realWidth * value);
        paper.height(realHeight * value);
        
        $("#paperWrapper").width(realWidth * value);
        $("#paperWrapper").height(realHeight * value);

        this._paint.eventEmitter.triggerOnZoom(null);
    }

    get Zoom() : number {
        return this._zoom;    
    }
    
    setCursorFromURL(cursor:string, x:number=null, y:number=null) : void {
        this.setCursor("url(" + encodeURI(cursor) + ")", x, y);
    }
    
    setCursor(cursor:string, x:number=null, y:number=null) : void {
        var $ = this._paint.$;
        
        if((x === null && y !== null) || (x !== null && y === null))
            throw "Both or none of the coordinates should be specified.";
        
        var offset = "";
        if(x !== null) {
            offset = " " + x + " " + y;
        }
        
        $(this.paperElement).css('cursor', cursor + offset + ",default");
    }
    
    restoreCursor() {
        var $ = this._paint.$;
        $(this.paperElement).css('cursor', '');
    }
    
    getCanvas() : HTMLCanvasElement {
        var paper = this._paint.$(this._paper);
        var saveCanvas = this._paint.document.createElement('canvas');
        saveCanvas.width = paper.width();
        saveCanvas.height = paper.height();
        
        for(var i = 0; i < this._layers.length; i++) {
            var layer = this._layers[i];
            saveCanvas.getContext('2d').drawImage(layer.canvas, 0, 0);
        }
        
        return saveCanvas;
    }
   
}