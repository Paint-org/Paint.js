import color = require('./Color');

export class ColorMatrix
{
    private data : Uint8Array;
    private width : number;
    private height : number;
    
    constructor(data : Uint8Array, width : number, height : number) {
        this.data = data;
        this.width = width;
        this.height = height;
    }
    
    getValue(x : number, y : number) : color.Color {
        var coord = this.translateCoordinates(x, y);
        return color.Color.fromRGB(
            this.data[coord],
            this.data[coord + 1],
            this.data[coord + 2]    
        ); 
    }
    
    setValue(x : number, y : number, value : color.Color) {
        var coord = this.translateCoordinates(x, y);
                
        this.data[coord] = value.R,
        this.data[coord + 1] = value.G,
        this.data[coord + 2] = value.B;
    }
    
    /**
     * Converts from a XY representation to a single-index matrix
     * representation (going left->right, top->down), considering
     * an offset of 4 cells for each position.
     */
    private translateCoordinates(x : number, y : number) : number {
        return ((y * this.width) + x) * 4; 
    }
}