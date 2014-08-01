module Paint {
    export class PaperLayer {

        private _paint: Paint.Global;
        private _context: CanvasRenderingContext2D;

        private _zoom: number = 1;
        private _background: Paint.Color = null;

        public canvas: HTMLCanvasElement;

        /**
         * Create a new PaperLayer.
         * \param background the background color of the layer. If null, it's transparent.
         */
        constructor(paint: Paint.Global, canvas: HTMLCanvasElement, background: Paint.Color) {

            this._paint = paint;

            this.canvas = canvas;
            this._context = canvas.getContext('2d');
            this._background = background;

            this.fillBackground(background);
        }

        getContext(): CanvasRenderingContext2D {
            return this._context;
        }

        getCanvasMatrix(rect: Paint.Rectangle = null): Paint.CanvasMatrix {
            if (rect === null) {
                rect = new Paint.Rectangle(new Paint.Point(0, 0), this.canvas.width, this.canvas.height);
            }

            var loc = rect.Location;
            var imgd = this._context.getImageData(loc.X, loc.Y, rect.Width, rect.Height);   
            var cm = new Paint.CanvasMatrix(imgd, rect);

            return cm;
        }

        copyTo(layer: PaperLayer) {
            layer._context.drawImage(this.canvas, 0, 0);
        }

        /**
         * Draws an aliased line on the given colorMatrix.
         * FIXME Implement size
         */
        static drawAliasedLine(x0, y0, x1, y1, size, color: Paint.Color, matrix: Paint.ColorMatrix) {
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx - dy;
            var w = matrix.width;
            var h = matrix.height;

            while (true) {
                if (x0 >= 0 && y0 >= 0 && x0 < w && y0 < h)
                    matrix.setValue(x0, y0, color);

                if ((x0 == x1) && (y0 == y1)) break;
                var e2 = err << 1;
                if (e2 > -dy) { err -= dy; x0 += sx; }
                if (e2 < dx) { err += dx; y0 += sy; }
            }
        }

        private fillBackground(color: Paint.Color) {
            if (color != null) {
                this._context.save();
                this._context.setTransform(1, 0, 0, 1, 0, 0);
                this._context.fillStyle = color.HexString;
                this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this._context.restore();
            }
        }

        restoreImage(savedCanvas: HTMLCanvasElement) {
            this.fillBackground(this._background);
            this.getContext().drawImage(savedCanvas, 0, 0);
        }
    }
}