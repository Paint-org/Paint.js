var Brush = (function () {
    function Brush() {
    }
    Object.defineProperty(Brush.prototype, "width", {
        get: function () {
            return 5;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Brush.prototype, "color", {
        get: function () {
            return "#000000";
        },
        enumerable: true,
        configurable: true
    });
    return Brush;
})();
exports.Brush = Brush;
