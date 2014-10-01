module Paint {
    export class CanvasMatrix {
        private _img: ImageData;
        private _matrix: Paint.ColorMatrix;
        private _location: Paint.Point;

        constructor(img: ImageData, location: Paint.Point) {
            this._img = img;
            this._matrix = new Paint.ColorMatrix(img.data, img.width, img.height);
            this._location = location;
        }

        get colorMatrix(): Paint.ColorMatrix {
            return this._matrix;
        }

        apply(context: CanvasRenderingContext2D) {
            context.putImageData(this._img, this._location.X, this._location.Y);
        }
    }
}