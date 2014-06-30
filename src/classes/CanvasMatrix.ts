module Paint {
    export class CanvasMatrix {
        private _img: ImageData;
        private _matrix: Paint.ColorMatrix;

        constructor(img: ImageData) {
            this._img = img;
            this._matrix = new Paint.ColorMatrix(img.data, img.width, img.height);
        }

        get colorMatrix(): Paint.ColorMatrix {
            return this._matrix;
        }

        apply(context: CanvasRenderingContext2D) {
            context.putImageData(this._img, 0, 0);
        }
    }
}