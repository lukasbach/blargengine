import {IGameProps, ISerializedPosition} from "./types";
import {Position} from "./Position";

export class RenderContext {
  private readonly canvas: CanvasRenderingContext2D;
  private readonly props: IGameProps;
  private offset: ISerializedPosition;

  get pixelSize() {
    return this.props.pixelSize;
  }

  get tileSize() {
    return this.props.tileSize;
  }

  constructor(canvas: CanvasRenderingContext2D, props: IGameProps, offset?: ISerializedPosition) {
    this.canvas = canvas;
    this.props = props;
    this.offset = offset || { x: 0, y: 0 };
  }

  withOffset(offset: ISerializedPosition | Position): RenderContext {
    offset = Position.fromPosition(offset);
    return new RenderContext(this.canvas, this.props, {
      x: this.offset.x + offset.x,
      y: this.offset.y + offset.y,
      xOffset: this.offset.xOffset && offset.xOffset
        ? (this.offset.xOffset || 0) + (offset.xOffset || 0) : undefined,
      yOffset: this.offset.yOffset && offset.yOffset
        ? (this.offset.yOffset || 0) + (offset.yOffset || 0) : undefined
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
