import {Layer} from "./Layer";
import {Entity} from "./Entity";

export class EntityCollection {
  private aliases: string[];
  private layers: Layer[];
  private entities: Entity[];
  private resolveAlias: (alias: string) => Entity[];

  constructor(resolveAlias: (alias: string) => Entity[], ...items: (string | Layer | Entity)[]) {
    this.aliases = [];
    this.layers = [];
    this.entities = [];
    this.resolveAlias = resolveAlias;

    for (const item of items) {
      this.addItem(item);
    }
  }

  public forEach(handler: (item: Entity, index: number) => void) {
    let i = 0;

    this.entities.forEach(e => handler(e, i++));
    this.layers.forEach(l => l.entities.forEach(e => handler(e, i++)));
    this.aliases.forEach(a => this.resolveAlias(a).forEach(e => handler(e, i++)));
  }

  public map<T>(handler: (item: Entity, index: number) => T) {
    const newList: T[] = [];
    this.forEach((item, index) => newList.push(handler(item, index)));
    return newList;
  }

  public isIncluded(item: string | Layer | Entity) {
    if (typeof item === "string") {
      this.aliases.includes(item);
    } else if (item instanceof Layer) {
      this.layers.includes(item);
    } else if (item instanceof Entity) {
      this.entities.includes(item);
    }
  }

  public addItem(item: string | Layer | Entity) {
    if (typeof item === "string") {
      this.aliases.push(item);
    } else if (item instanceof Layer) {
      this.layers.push(item);
    } else if (item instanceof Entity) {
      this.entities.push(item);
    }
  }
}