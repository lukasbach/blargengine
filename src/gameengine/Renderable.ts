import {RenderContext} from "./RenderContext";
import {ICanReceiveInput, ISerializedPosition} from "./types";

export interface Renderable extends ICanReceiveInput {
  render(renderContext: RenderContext): void;
}

export interface RenderableAt {
  renderAt(renderContext: RenderContext, position: ISerializedPosition): void;
}
