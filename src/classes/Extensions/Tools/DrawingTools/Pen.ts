import glob = require('../../../Global');
import color = require('../../../Color');
import drawTool = require('./DrawingTool');
import point = require('../../../Point');
   
export class Pen extends drawTool.DrawingTool
{
    static EXTENSION_NAME : string = "Pen";
    paint : glob.Paint;
    
    public constructor(paint:glob.Paint) {
        super(paint);
        this.paint = paint;
    }
    
    init() {
        this.addToolbarToolItem(null, "Pen");
    }

    activated() {
        console.log("Registrazione del tool Pen");
        super.activated();
    }    
    
    inkColor() : color.Color {
        return this.paint.primaryColor;
    }
    
   /** Gets function that draw on context
    * \param pt point in canvas coordinates  
    */
    getDrawingFunction(pt : point.Point) : (context : CanvasRenderingContext2D) => void {

        return function(context : CanvasRenderingContext2D) {
            context.lineTo(pt.X, pt.Y);
            context.stroke(); 
        }
    }
}