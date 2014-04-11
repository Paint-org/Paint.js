import glob = require('../../classes/Global');
import point = require('../../classes/Point');
import paperLayer = require('../../classes/PaperLayer');
import color = require('../../classes/Color');

class ColorPicker
{
    public EXTENSION_NAME : string = "com.paintjs.ColorPicker";
    paint : glob.Paint;
    
    constructor(paint : glob.Paint) {
        this.paint = paint;
    }
    
    init() {
        this.paint.barManager.addToolbarToolItem(null, "ColorPicker", this);
    }

    activated(id:string) {
        this.paint.currentPaper.setCursorFromURL("cursors/picker.cur");        
    }
    
    deactivated() {
        this.paint.currentPaper.restoreCursor();
    }
    
    onPaperClick(pt : point.Point) {
        var layers = this.paint.currentPaper.layers;
        
        if (layers.length <= 0)
            return;
            
        for (var i = layers.length - 1; i >= 0; i--) {
            var result = this.tryFindColor(layers[i], pt);
            
            if (result !== null) {
                this.paint.primaryColor = result; 
                return;    
            }            
        }
        
        this.paint.primaryColor = color.Color.White;
    }
    
    private tryFindColor(layer : paperLayer.PaperLayer, pt : point.Point) : color.Color {
        var col = layer.getCanvasMatrix().colorMatrix.getValue(pt.X, pt.Y);
        
        if(!col.equals(color.Color.White))
            return col;
        
        return null;
    }
}

exports.Extensions = new Array();
exports.Extensions.push(ColorPicker);