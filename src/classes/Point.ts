export class Point {

    private _x : number;
    private _y : number;
    
    constructor(x : number, y : number) {
        this._x = x;
        this._y = y;
    }
    
    get X():number {
        return this._x
    }
    
    get Y():number {
        return this._y
    }
    
    distanceFrom(pt : Point) : number {
        return Math.sqrt(Math.pow(this._x - pt.X, 2) + Math.pow(this._y - pt.Y, 2));
    }
    
    angleFrom(pt : Point) : number {
        return Math.atan2(this._x - pt.X, this._y - pt.Y);
    }
    
    equals(pt : Point) : boolean {
        return (this.X === pt.X && this.Y === pt.Y);
    }
}