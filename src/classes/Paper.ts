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
    }
    
    get paperElement() : HTMLElement {
        return this._paper;
    }
    
    get baseLayer() : paperLayer.PaperLayer {
        return this._layers[0];
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
        
        $('#paperWrapper').append(newCanvas);
        
        // Add the layer to the internal array
        var layer = new paperLayer.PaperLayer(this._paint, <HTMLCanvasElement>newCanvas[0], background);
        this._layers.push(layer);
        
        return layer;
    }
    
    /**
     * Removes the current layer.
     */
    removeLayer(layer : paperLayer.PaperLayer) {
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
    }
    
    onResizeEnd() {
        this._savedCanvas = [];
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
    }

    get Zoom() : number {
        return this._zoom;    
    }
    
    save(filename, callback) {
        var paper = this._paint.$(this._paper);
        var saveCanvas = this._paint.document.createElement('canvas');
        saveCanvas.width = paper.width();
        saveCanvas.height = paper.height();
        
        for(var i = 0; i < this._layers.length; i++) {
            var layer = this._layers[i];
            saveCanvas.getContext('2d').drawImage(layer.canvas, 0, 0);
        }
        
        var image = saveCanvas.toDataURL();
        image = image.replace(/^data:image\/png;base64,/,"");
        
        var fs = require('fs');
        fs.writeFile(filename, image, "base64", callback);
    }
}