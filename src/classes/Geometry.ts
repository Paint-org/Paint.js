module Paint {
    export class Point {

        private _x: number;
        private _y: number;

        constructor(x: number, y: number) {
            this._x = x;
            this._y = y;
        }

        get X(): number {
        return this._x
    }

        get Y(): number {
        return this._y
    }

        distanceFrom(pt: Point): number {
            return Math.sqrt(Math.pow(this._x - pt.X, 2) + Math.pow(this._y - pt.Y, 2));
        }

        angleFrom(pt: Point): number {
            return Math.atan2(this._x - pt.X, this._y - pt.Y);
        }

        equals(pt: Point): boolean {
            return (this.X === pt.X && this.Y === pt.Y);
        }
    }

    export class Rectangle {

        private _location: Paint.Point;
        private _width: number;
        private _height: number;


        constructor(location: Paint.Point, width: number, height: number) {
            this._location = location,
            this._width = width,
            this._height = height;
        }

        isZero(): boolean {
            return this.Width === 0 || this.Height === 0;
        }

        get Location(): Paint.Point {
            return this._location;
        }

        get Width(): number {
            return this._width;
        }

        get Height(): number {
            return this._height;
        }

        get Area(): number {
            return this._width * this._height;
        }

    }
}