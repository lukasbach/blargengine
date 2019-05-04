import {IGameProps, ISerializedPosition} from "./types";
import {Position} from "./Position";

export interface RenderContext {
  readonly pixelSize: number;
  readonly tileSize: number;
  readonly width: number;
  readonly height: number;
  withOffset(offset: ISerializedPosition | Position): RenderContext;
  drawPixel(position: ISerializedPosition, color: string): void;
  drawBox(position: ISerializedPosition, color: string, width: number, height: number): void;
}

export interface IMeasurements {
  right: number,
  bottom: number, // / this.tileSize
  top: number,
  left: number
}

export class CanvasRenderContext implements RenderContext {
  private readonly canvas: CanvasRenderingContext2D;
  private readonly canvasEl: HTMLCanvasElement;
  private readonly props: IGameProps;
  private offset: ISerializedPosition;

  get pixelSize() {
    return this.props.pixelSize;
  }

  get tileSize() {
    return this.props.tileSize;
  }

  get width() {
    return this.canvasEl.scrollWidth / this.pixelSize;
  }

  get height() {
    return this.canvasEl.scrollHeight / this.pixelSize;
  }

  constructor(canvas: CanvasRenderingContext2D, canvasEl: HTMLCanvasElement, props: IGameProps, offset?: ISerializedPosition) {
    this.canvas = canvas;
    this.canvasEl = canvasEl;
    this.props = props;
    this.offset = offset || { x: 0, y: 0 };
  }

  withOffset(offset: ISerializedPosition | Position): RenderContext {
    offset = Position.fromPosition(offset);
    return new CanvasRenderContext(this.canvas, this.canvasEl, this.props, {
      x: this.offset.x + offset.x,
      y: this.offset.y + offset.y,
      xOffset: this.offset.xOffset
        ? (this.offset.xOffset || 0) + (offset.xOffset || 0) : offset.xOffset,
      yOffset: this.offset.yOffset
        ? (this.offset.yOffset || 0) + (offset.yOffset || 0) : offset.yOffset
    });
  }

  drawPixel(position: ISerializedPosition, color: string) {
    /*const { pixelSize, tileSize } = this.props;

    this.canvas.fillStyle = color;
    this.canvas.fillRect(
      (this.offset.x + position.x) * tileSize * pixelSize + ((this.offset.xOffset || 0) + (position.xOffset || 0)) * pixelSize,
      (this.offset.y + position.y) * tileSize * pixelSize + ((this.offset.yOffset || 0) + (position.yOffset || 0)) * pixelSize,
      pixelSize,
      pixelSize,
    );*/
    this.drawBox(position, color, 1, 1);
  }

  drawBox(position: ISerializedPosition, color: string, width: number, height: number) {
    const { pixelSize, tileSize } = this.props;

    this.canvas.fillStyle = color;
    this.canvas.fillRect(
      (this.offset.x + position.x) * tileSize * pixelSize + ((this.offset.xOffset || 0) + (position.xOffset || 0)) * pixelSize,
      (this.offset.y + position.y) * tileSize * pixelSize + ((this.offset.yOffset || 0) + (position.yOffset || 0)) * pixelSize,
      pixelSize * width,
      pixelSize * height,
    );
  }
}

export class MeasureRenderContext implements RenderContext {
  private offset: ISerializedPosition;
  private measuredRight: number = 0;
  private measuredLeft: number = 0;
  private measuredBottom: number = 0;
  private measuredTop: number = 0;
  private static props: IGameProps;
  private updateContainerCtx?: (p: Position | ISerializedPosition) => void;

  public readonly pixelSize: number;
  public readonly tileSize: number;
  public readonly width = 10000;
  public readonly height = 10000;

  constructor(offset?: ISerializedPosition, updateContainerCtx?: (p: Position | ISerializedPosition) => void) {
    this.offset = offset || { x: 0, y: 0 };
    this.pixelSize = MeasureRenderContext.props.pixelSize;
    this.tileSize = MeasureRenderContext.props.tileSize;
    this.updateContainerCtx = updateContainerCtx;
    this.resetMeasurements();
  }

  public resetMeasurements() {
    this.measuredRight = 0;
    this.measuredLeft = 10000;
    this.measuredBottom = 0;
    this.measuredTop = 10000;
  }

  public static setGameProps(props: IGameProps) {
    this.props = props;
  }

  public drawBox(position: ISerializedPosition, color: string, width: number, height: number): void {
    this.addPosition(position);
    this.addPosition(Position.fromSum(position, new Position(0, 0, width, height)));
  }

  public drawPixel(position: ISerializedPosition, color: string): void {
    this.addPosition(position);
  }

  public withOffset(offset: ISerializedPosition | Position): RenderContext {
    return new MeasureRenderContext(
      offset,
      p => {
        this.addPosition(Position.fromSum(offset, p))
      }
    );
  }

  private addPosition(position: ISerializedPosition | Position) {
    if (this.updateContainerCtx) {
      this.updateContainerCtx(position);
    }

    this.measuredRight = Math.max(
      this.measuredRight,
      position.x * this.tileSize + (position.xOffset || 0)
    );
    this.measuredBottom = Math.max(
      this.measuredBottom,
      position.y * this.tileSize + (position.yOffset || 0)
    );

    this.measuredLeft = Math.min(
      this.measuredLeft,
      position.x * this.tileSize + (position.xOffset || 0)
    );
    this.measuredTop = Math.min(
      this.measuredTop,
      position.y * this.tileSize + (position.yOffset || 0)
    );
  }

  public getMeasurements(): IMeasurements {
    return {
      right: this.measuredRight, // / this.tileSize,
      bottom: this.measuredBottom, // / this.tileSize
      top: this.measuredTop,
      left: this.measuredLeft
    };
  }
}
