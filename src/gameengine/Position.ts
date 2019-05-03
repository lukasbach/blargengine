import {ISerializedPosition} from "./types";

export class Position {
  private _x: number;
  private _y: number;
  private _xOffset: number;
  private _yOffset: number;

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get xOffset() {
    return this._xOffset;
  }

  get yOffset() {
    return this._yOffset;
  }

  public static Up = new Position(0, -1);
  public static Down = new Position(0, 1);
  public static Right = new Position(1, 0);
  public static Left = new Position(-1, 0);

  constructor(x: number, y: number, xOffset?: number, yOffset?: number) {
    this._x = x;
    this._y = y;
    this._xOffset = xOffset || 0;
    this._yOffset = yOffset || 0;
  }

  public static fromSerializedPosition(pos: ISerializedPosition): Position {
    return new Position(pos.x, pos.y, pos.xOffset, pos.yOffset);
  }

  public static fromPosition(pos: ISerializedPosition | Position): Position {
    if (pos instanceof Position) {
      return pos;
    } else {
      return this.fromSerializedPosition(pos);
    }
  }

  public static fromSum(...positions: (ISerializedPosition | Position)[]): Position {
    const pos = new Position(0, 0, 0, 0);

    for (const p of positions) {
      pos.add(p);
    }

    return pos;
  }

  public getPushPosition(): Position {
    if (this.x !== 0) {
      return new Position(this.x < 0 ? -1 : 1, 0);
    } else if (this.y !== 0) {
      return new Position(0, this.y < 0 ? -1 : 1);
    } else {
      return new Position(0, 0);
    }
  }

  public clone(): Position {
    return new Position(this._x, this._y, this._xOffset, this._yOffset);
  }

  public add(pos: Position | ISerializedPosition) {
    const p = Position.fromPosition(pos);
    this._x += p.x;
    this._y += p.y;
    this._xOffset += p.xOffset;
    this._yOffset += p.yOffset;
  }

  public equals(pos: Position | ISerializedPosition) {
    pos = Position.fromPosition(pos);

    return (
      pos.x === this.x &&
      pos.y === this.y &&
      pos.xOffset === this.xOffset &&
      pos.yOffset === this.yOffset
    );
  }

  public isAdjacent(pos: Position | ISerializedPosition) {
    return [Position.Up, Position.Down, Position.Right, Position.Left]
      .map(p => Position.fromSum(pos, p).equals(this))
      .reduce((a, b) => a || b, false);
  }

  public toString() {
    return `${this.x};${this.y};${this.xOffset};${this.yOffset}`;
  }
}