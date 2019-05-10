import {Entity} from "./entities/Entity";
import {RenderContext} from "./RenderContext";
import {ISerializedPosition, ITimeTravelable} from "./types";
import {Renderable} from "./Renderable";

export class Layer implements ITimeTravelable, Renderable {
  entities: Entity[];

  constructor() {
    this.entities = []
  }

  addEntity(e: Entity, onlyIfEmpty?: boolean) {
    if (!onlyIfEmpty || !this.getAt(e.getPosition())) {
      this.entities.push(e);
    }
  }

  removeEntity(e: Entity) {
    this.entities = this.entities.filter(e_ => e_ !== e);
  }

  getAt(p: ISerializedPosition) {
    return this.entities.find(e => e.isAt(p));
  }

  public render(renderContext: RenderContext) {
    for (const e of this.entities) {
      e.render(renderContext);
    }
  }

  public findFromAlias(alias: string) {
    return this.entities.find(e => e.alias === alias);
  };

  goBack(): void {
    this.entities.forEach(e => e.goBack());
  }

  storeStep(): void {
    this.entities.forEach(e => e.storeStep());
  }
}
