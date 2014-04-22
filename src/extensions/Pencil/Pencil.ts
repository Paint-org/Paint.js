import glob = require('../../classes/Global');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import paperLayer = require('../../classes/PaperLayer');

class Pencil {
    public EXTENSION_NAME: string = "com.paintjs.Pencil";
    paint: glob.Paint;
    private _lastPt: point.Point = null;

    public constructor(paint: glob.Paint) {
        this.paint = paint;
    }

    init() {
        this.paint.barManager.addToolbarToolItem("extensions/Pencil/icon.png", "Pencil", this);
        this.paint.registerTool(this);
    }

    activated(id: string) {
        this.paint.currentPaper.setCursorFromURL("cursors/pencil.cur");
    }

    deactivated() {
        this.paint.currentPaper.restoreCursor();
    }

    onStartDrawing(paper: paper.Paper, point: point.Point) {
        this._lastPt = point;
        this.onDraw(paper, point);
    }

    onDraw(paper: paper.Paper, point: point.Point) {
        var matrix = paper.baseLayer.getCanvasMatrix();

        paperLayer.PaperLayer.drawAliasedLine(
            this._lastPt.X,
            this._lastPt.Y,
            point.X,
            point.Y,
            this.paint.toolSize,
            this.paint.primaryColor,
            matrix.colorMatrix);

        matrix.apply(paper.baseLayer.getContext());

        this._lastPt = point;
    }
}

exports.Extensions = new Array();
exports.Extensions.push(Pencil);