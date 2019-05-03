import {Entity} from "./Entity";
import {RenderContext} from "./RenderContext";
import {ISerializedPosition, ITimeTravelable} from "./types";
import {Renderable} from "./Renderable";

export class Layer extends Renderable implements ITimeTravelable {
  entities: Entity[];

  constructor() {
    super();

    this.entities = []
  }

  addEntity(e: Entity, onlyIfEmpty?: boolean) {
    if (!onlyIfEmpty || !this.getAt(e.getPosition())) {
      this.entities.push(e);
    }
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
