import glob = require('../Global');

/**
 * A Tool is an instrument that the user uses to do an action on the canvas.
 * Examples of tools are the selection tool, the pen, the brush,
 * the fill instrument, the rectangle shape, etc.
 */
export class Tool
{
    static TOOL_NAME : string = "";

    constructor(paint:glob.Paint) {
        
    }
    
    init() {
    
    }
    
    addToToolbar(icon, name, description) {
        // TODO
        // Fare in modo che la pagina HTML sia il più generica possibile
        // e fare il grosso del lavoro nel CSS, in modo da rendere più
        // skinnabile il tutto.
    }
    
    removeFromToolbar() {
        // TODO
    }
    
    /**
     * Gets called when the user selects this tool.
     */
    activated() {
        
    }
    
    /**
     * Gets called when the user selects another tool.
     */
    deactivated() {
        
    }
}