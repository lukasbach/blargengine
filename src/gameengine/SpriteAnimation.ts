import {RenderContext} from "./RenderContext";
import {ComposedRenderable} from "./Renderable";

export class SpriteAnimation implements ComposedRenderable {
  private frames: ComposedRenderable[];
  private timePerFrame = 50;
  private frameCounter = 0;
  private frameId = 0;

  constructor(frames: ComposedRenderable[], timePerFrame: number = 5) {
    this.frames = frames;
    this.timePerFrame = timePerFrame;
  }

  public render(renderContext: RenderContext): void {
    if (this.frameCounter < this.timePerFrame) {
      this.frameCounter++;
    } else {
      this.frameCounter = 0;
      this.frameId = (this.frameId + 1) % this.frames.length;
    }

    if (this.frameId < this.frames.length) {
      this.frames[this.frameId].render(renderContext);
    }
  }

  public addFrame(sprite: ComposedRenderable) {
    this.frames.push(sprite);
  }

  public getPieces(tileSize: number) {
    let output: Array<{ x: number, y: number, sprite: SpriteAnimation }> = [];

    const piecedFrames = this.frames.map(frame => frame.getPieces(tileSize));

    output = piecedFrames[0].map(piece => ({
      x: piece.x,
      y: piece.y,
      sprite: new SpriteAnimation([], this.timePerFrame)
    }));

    piecedFrames.forEach((piecedFrame, i) => {
      piecedFrame.forEach((framePiece, j) => {
        output[j].sprite.addFrame(framePiece.sprite);
      })
    });

    return output;
  }
}
