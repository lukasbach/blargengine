import {RenderContext} from "./RenderContext";
import {Renderable} from "./Renderable";
import {Layer} from "./Layer";
import {ITimeTravelable} from "./types";

export class Board implements ITimeTravelable, Renderable {
  private layers: Layer[];
  private layerAliases: string[];

  constructor() {
    this.layers = [];
    this.layerAliases = [];
  }

  public newLayer(alias?: string): Layer {
    const l = new Layer();
    this.layers.push(l);
    this.layerAliases.push(alias || `Layer ${this.layers.length}`);
    return l;
  }

  public getLayer(id: string | number): Layer {
    if (typeof id === "string") {
      this.layerAliases.forEach((alias, idx) => {
        if (alias === id) {
          id = idx;
        }
      });
    }

    const layer = this.layers[id as number];

    if (!layer) {
      throw Error('Could not find layer.');
    } else {
      return layer;
    }
  }

  public render(renderContext: RenderContext) {
    for (const l of this.layers) {
      l.render(renderContext);
    }
  }

  public findEntityFromAlias(alias: string) {
    for (const layer of this.layers) {
      const entity = layer.findFromAlias(alias);
      if (entity) {
        return entity;
      }
    }
    return undefined;
  }

  goBack(): void {
    this.layers.forEach(l => l.goBack());
  }

  storeStep(): void {
    this.layers.forEach(l => l.storeStep());
  }
}
