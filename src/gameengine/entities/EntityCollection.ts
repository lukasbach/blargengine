import {Layer} from "../Layer";
import {Entity} from "./Entity";

export class EntityCollection {
  private aliases: string[];
  private layers: Layer[];
  private entities: Entity[];
  private resolveAlias: (alias: string) => Entity[];
  private filterFn: (entity: Entity) => boolean;

  constructor(
    resolveAlias: (alias: string) => Entity[],
    filter: (entity: Entity) => boolean,
    ...items: (string | Layer | Entity)[]
  ) {
    this.aliases = [];
    this.layers = [];
    this.entities = [];
    this.resolveAlias = resolveAlias;
    this.filterFn = filter;

    for (const item of items) {
      this.addItem(item);
    }
  }

  public forEach(handler: (item: Entity, index: number) => void): void {
    let i = 0;

    this.entities.filter(this.filterFn).forEach(e => handler(e, i++));
    this.layers.forEach(l => l.entities.filter(this.filterFn).forEach(e => handler(e, i++)));
    this.aliases.forEach(a => this.resolveAlias(a).filter(this.filterFn).forEach(e => handler(e, i++)));
  }

  public map<T>(handler: (item: Entity, index: number) => T): T[] {
    const newList: T[] = [];
    this.forEach((item, index) => newList.push(handler(item, index)));
    return newList;
  }

  public filter(handler: (item: Entity) => boolean): EntityCollection {
    const newFilterFn = (entity: Entity) => {
      return this.filterFn(entity) && handler(entity);
    };

    return new EntityCollection(this.resolveAlias, newFilterFn, ...this.aliases, ...this.entities, ...this.layers);
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

  public clone(): EntityCollection {
    return new EntityCollection(this.resolveAlias, this.filterFn, ...this.aliases, ...this.entities, ...this.layers);
  }
}