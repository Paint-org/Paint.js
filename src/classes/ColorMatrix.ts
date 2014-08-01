module Paint {
    export class ColorMatrix {
        private _data: Uint8Array;
        private _width: number;
        private _height: number;

        constructor(data: Uint8Array, width: number, height: number) {
            this._data = data;
            this._width = width;
            this._height = height;
        }

        getValue(x: number, y: number): Paint.Color {
            if (x < 0 || y < 0 || x >= this._width || y >= this.height)
                throw "Coordinates out of bounds";

            var coord = this.translateCoordinates(x, y);
            return Paint.Color.fromRGB(
                this._data[coord],
                this._data[coord + 1],
                this._data[coord + 2]
                );
        }

        setValue(x: number, y: number, value: Paint.Color) {
            if (x < 0 || y < 0 || x >= this._width || y >= this.height)
                throw "Coordinates out of bounds";

            var coord = this.translateCoordinates(x, y);

            this._data[coord] = value.R,
            this._data[coord + 1] = value.G,
            this._data[coord + 2] = value.B;
        }

        // For high-performance comparisons
        isValue(x: number, y: number, value: Paint.Color) {
            var coord = this.translateCoordinates(x, y);

            return this._data[coord] == value.R &&
                this._data[coord + 1] == value.G &&
                this._data[coord + 2] == value.B;
        }

        get data(): Uint8Array {
            return this._data;
        }

        get width(): number {
            return this._width;
        }

        get height(): number {
            return this._height;
        }

        /**
         * Converts from a XY representation to a single-index matrix
         * representation (going left->right, top->down), considering
         * an offset of 4 cells for each position.
         */
        private translateCoordinates(x: number, y: number): number {
            return ((y * this._width) + x) * 4;
        }
    }
}