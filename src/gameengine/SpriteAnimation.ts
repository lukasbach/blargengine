import {RenderContext} from "./RenderContext";
import {ISerializedPosition} from "./types";
import {Sprite} from "./Sprite";
import {RenderableAt} from "./Renderable";

export class SpriteAnimation extends RenderableAt {
  private frames: Sprite[];
  private timePerFrame: number = 5;

  constructor(frames: Sprite[], timePerFrame: number = 5) {
    super();

    this.frames = frames;
    this.timePerFrame = timePerFrame;
  }

  public renderAt(renderContext: RenderContext, position: ISerializedPosition): void {
  }
}
