import glob = require('../../classes/Global');
import point = require('../../classes/Point');
import paper = require('../../classes/Paper');
import paperLayer = require('../../classes/PaperLayer');

class Selection {
    public EXTENSION_NAME: string = "com.paintjs.Selection";
    paint: glob.Paint;

    private point1: point.Point = null;
    private _layer: paperLayer.PaperLayer;

    public constructor(paint: glob.Paint) {
        this.paint = paint;
    }

    init() {
        this.paint.registerTool(this);
        this.paint.barManager.addToolbarToolItem("extensions/Selection/icon.png", "Select", this);
    }

    onStartDrawing(paper: paper.Paper, point: point.Point) {
        this.point1 = point;

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        context.lineWidth = 1;
        context.setLineDash([4]);
        context.strokeStyle = "#3399FF";
    }

    onDraw(paper: paper.Paper, point: point.Point) {
        var canvas = this._layer.canvas;
        var context = this._layer.getContext();
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.rect(
            Math.min(this.point1.X, point.X) - 0.5,
            Math.min(this.point1.Y, point.Y) - 0.5,
            Math.abs(this.point1.X - point.X),
            Math.abs(this.point1.Y - point.Y));
        context.stroke();
        context.closePath();
    }

    onStopDrawing(paper: paper.Paper, point: point.Point) {
        paper.removeLayer(this._layer);
    }
}

exports.Extensions = [Selection];