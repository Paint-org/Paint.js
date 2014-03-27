import glob = require('../../Global');
import color = require('../../Color');
import tool = require('./Tool');
import toolPen = require('./Pen');
   
export class Eraser extends toolPen.Pen
{
    static EXTENSION_NAME : string = "Eraser";
    paint : glob.Paint;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = paint.$;
        $("#topBar").append('<button id="btnEraser">Eraser</button>');
        
        var curInstance = this;
        $("#btnEraser").click(function() {
            paint.currentTool = curInstance;
        });
    }
    
    inkColor() : color.Color {
        return this.paint.secondaryColor;
    }
}