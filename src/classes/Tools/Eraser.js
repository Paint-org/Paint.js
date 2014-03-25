var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pen = require('../Pen');
var brush = require('../Brush');

var toolPen = require('./Pen');

var Eraser = (function (_super) {
    __extends(Eraser, _super);
    function Eraser(paint) {
        _super.call(this, paint);
        this.paint = paint;
    }
    Eraser.prototype.init = function () {
        var paint = this.paint;
        var $ = paint.$;
        $("#topBar").append('<button id="btnEraser">Eraser</button>');

        var curInstance = this;
        $("#btnEraser").click(function () {
            paint.currentPen = new pen.Pen(new brush.Brush($("#penColor2").val()), parseInt($("#penSize").val()));
            paint.currentTool = curInstance;
        });
    };
    Eraser.TOOL_NAME = "Eraser";
    return Eraser;
})(toolPen.Pen);
exports.Eraser = Eraser;
