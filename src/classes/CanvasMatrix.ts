import colorMatrix = require('./ColorMatrix');

export class CanvasMatrix
{
    private _img : ImageData;
    private _matrix : colorMatrix.ColorMatrix;
    
    constructor(img : ImageData) {
        this._img = img;
        this._matrix = new colorMatrix.ColorMatrix(img.data, img.width, img.height);
    }
    
    get colorMatrix() : colorMatrix.ColorMatrix {
        return this._matrix;
    }
    
    apply(context : CanvasRenderingContext2D) {
        context.putImageData(this._img, 0, 0);
    }
}