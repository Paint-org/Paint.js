var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pen = require('../Pen');
var brush = require('../Brush');
var tool = require('./Tool');

var Pen = (function (_super) {
    __extends(Pen, _super);
    function Pen(paint) {
        _super.call(this, paint);
        this.paint = paint;
    }
    Pen.prototype.init = function () {
        var paint = this.paint;
        var $ = paint.$;
        $("#topBar").append('<button id="btnPen">Pen</button>');

        var curInstance = this;
        $("#btnPen").click(function () {
            paint.currentPen = new pen.Pen(new brush.Brush($("#penColor1").val()), parseInt($("#penSize").val()));
            paint.currentTool = curInstance;
        });
    };

    Pen.prototype.activated = function () {
        _super.prototype.activated.call(this);

        console.log("Registrazione del tool Pen");

        var paint = this.paint;
        var $ = paint.$;
        var document = paint.document;

        // Load context
        var canvas = paint.currentPaper.canvas;

        $(canvas).on("mousedown", $.proxy(this.canvas_mousedown, this));
        $(canvas).on("mouseenter", $.proxy(this.canvas_mouseenter, this));
        $(document).on("mousemove", $.proxy(this.document_mousemove, this));
        $(canvas).on("mouseleave", $.proxy(this.canvas_mouseleave, this));
        $(document).on("mouseup", $.proxy(this.document_mouseup, this));
    };

    Pen.prototype.deactivated = function () {
        var $ = this.paint.$;
        var document = this.paint.document;
        var canvas = this.paint.currentPaper.canvas;

        $(canvas).off("mousedown", this.canvas_mousedown);
        $(canvas).off("mouseenter", this.canvas_mouseenter);
        $(document).off("mousemove", this.document_mousemove);
        $(canvas).off("mouseleave", this.canvas_mouseleave);
        $(document).off("mouseup", this.document_mouseup);
    };

    Pen.prototype.canvas_mousedown = function (ev) {
        this.paint.currentPaper.startDrawing();
    };

    Pen.prototype.canvas_mouseenter = function (ev) {
        if (this.paint.currentPaper.isDrawing())
            this.paint.currentPaper.startDrawing();
    };

    Pen.prototype.document_mousemove = function (ev) {
        var cord = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.recordOuterPoint(cord);

        if (ev.target === this.paint.currentPaper.canvas) {
            this.paint.currentPaper.draw(ev.offsetX, ev.offsetY);
        }
    };

    Pen.prototype.canvas_mouseleave = function (ev) {
        var point = this.paint.currentPaper.pageXYtoCanvasXY(ev.pageX, ev.pageY);
        this.paint.currentPaper.exitFromPaper(point);
    };

    Pen.prototype.document_mouseup = function (ev) {
        this.paint.currentPaper.stopDrawing();
    };
    Pen.TOOL_NAME = "Pen";
    return Pen;
})(tool.Tool);
exports.Pen = Pen;
