module Paint {
    export class CanvasMatrix {
        private _img: ImageData;
        private _matrix: Paint.ColorMatrix;
        private _rectangle: Paint.Rectangle;

        constructor(img: ImageData, rect: Paint.Rectangle) {
            this._img = img;
            this._matrix = new Paint.ColorMatrix(img.data, img.width, img.height);
            this._rectangle = rect;
        }

        get colorMatrix(): Paint.ColorMatrix {
            return this._matrix;
        }

        apply(context: CanvasRenderingContext2D) {
            var loc = this._rectangle.Location;
            context.putImageData(this._img, loc.X, loc.Y);
        }
    }
}