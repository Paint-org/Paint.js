import glob = require('../../classes/Global');
import color = require('../../classes/Color');
import point = require('../../classes/Point');
import drawTool = require('../../classes/DrawingTool');

export class Eraser extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Eraser";
    paint : glob.Paint;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        this.addToolbarToolItem(null, "Eraser");
    }
    
    activated() {
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