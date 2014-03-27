import glob = require('../../Global');
import extension = require('../Extension');

/**
 * A Tool is an instrument that the user uses to do an action on the canvas.
 * Examples of tools are the selection tool, the pen, the brush,
 * the fill instrument, the rectangle shape, etc.
 */
export class Tool extends extension.Extension
{
    static TOOL_NAME : string = "";

    constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
    
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