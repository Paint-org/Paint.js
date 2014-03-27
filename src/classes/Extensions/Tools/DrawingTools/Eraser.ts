import glob = require('../../../Global');
import color = require('../../../Color');
import point = require('../../../Point');
import tool = require('./../Tool');
import drawTool = require('./DrawingTool');
   
export class Eraser extends drawTool.DrawingTool
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
        
        $("#btnEraser").click($.proxy(function() {
            paint.currentTool = this;
        }, this));
    }
    
    activated() {
        console.log("Registrazione del tool Eraser");
        super.activated();
    }
    
    inkColor() : color.Color {
        return color.Colors.White;
    }
    
    /**
     * Gets function that draw on context
     */
    getDrawingFunction(pt : point.Point) : (context : CanvasRenderingContext2D) => void {

        return function(context : CanvasRenderingContext2D) {
            context.lineTo(pt.X, pt.Y);
            context.stroke(); 
        }
    }
}