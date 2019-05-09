import {RenderContext} from "./RenderContext";
import {ICanReceiveInput, ISerializedPosition} from "./types";

export interface Renderable extends ICanReceiveInput {
  render(renderContext: RenderContext): void;
}

/*export interface RenderableAt {
  renderAt(renderContext: RenderContext, position: ISerializedPosition): void;
}*/

export interface ComposedRenderable extends Renderable {
  getPieces(tileSize: number): Array<{ x: number, y: number, sprite: ComposedRenderable }>;
}