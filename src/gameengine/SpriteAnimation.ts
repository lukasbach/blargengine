import {RenderContext} from "./RenderContext";
import {ComposedRenderable} from "./Renderable";

export class SpriteAnimation implements ComposedRenderable {
  private frames: ComposedRenderable[];
  private timePerFrame: number = 5;

  constructor(frames: ComposedRenderable[], timePerFrame: number = 5) {
    this.frames = frames;
    this.timePerFrame = timePerFrame;
  }

  public render(renderContext: RenderContext): void {
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
      piecedFrame.forEach(framePiece => {
        output[i].sprite.addFrame(framePiece.sprite);
      })
    });

    return output;
  }
}
