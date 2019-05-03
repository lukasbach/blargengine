import {RenderContext} from "./RenderContext";
import {ISerializedPosition} from "./types";

export abstract class Renderable {
  public abstract render(renderContext: RenderContext): void;
}

export abstract class RenderableAt {
  public abstract renderAt(renderContext: RenderContext, position: ISerializedPosition): void;
}
