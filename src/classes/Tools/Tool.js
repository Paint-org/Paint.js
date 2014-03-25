/**
* A Tool is an instrument that the user uses to do an action on the canvas.
* Examples of tools are the selection tool, the pen, the brush,
* the fill instrument, the rectangle shape, etc.
*/
var Tool = (function () {
    function Tool(paint) {
    }
    Tool.prototype.init = function () {
    };

    Tool.prototype.addToToolbar = function (icon, name, description) {
        // TODO
        // Fare in modo che la pagina HTML sia il più generica possibile
        // e fare il grosso del lavoro nel CSS, in modo da rendere più
        // skinnabile il tutto.
    };

    Tool.prototype.removeFromToolbar = function () {
        // TODO
    };

    /**
    * Gets called when the user selects this tool.
    */
    Tool.prototype.activated = function () {
    };

    /**
    * Gets called when the user selects another tool.
    */
    Tool.prototype.deactivated = function () {
    };
    Tool.TOOL_NAME = "";
    return Tool;
})();
exports.Tool = Tool;
