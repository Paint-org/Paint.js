import color = require('./Color');

export class Matrix
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
        var coord = this.translateCoordinates(x, y),
            rgb = value.toRGB();
                
        this.data[coord] = rgb.R,
        this.data[coord + 1] = rgb.G,
        this.data[coord + 2] = rgb.B;
    }
    
    private translateCoordinates(x : number, y : number) : number {
        return ((y * this.width) + x) * 4; 
    }
}