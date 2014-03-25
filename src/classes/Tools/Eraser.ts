import glob = require('../Global');
import pen = require('../Pen');
import brush = require('../Brush');
import tool = require('./Tool');
import toolPen = require('./Pen');
   
export class Eraser extends toolPen.Pen
{
    static TOOL_NAME : string = "Eraser";
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
            paint.currentPen = new pen.Pen(
                new brush.Brush($("#penColor2").val()),
                parseInt($("#penSize").val())
            );
            paint.currentTool = curInstance;
        });
    }
}