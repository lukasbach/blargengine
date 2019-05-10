import {Entity} from "./Entity";
import {Layer} from "../Layer";
import {IEntityEventHandlers, IEntityPhysics} from "../types";
import {Sprite} from "../Sprite";
import {Position} from "../Position";
import {ComposedEntity} from "./ComposedEntity";
import {ComposedRenderable} from "../Renderable";

export class EntityTemplate<STATE = {}> {
  private animations: Array<{
    name: string;
    render: ComposedRenderable;
  }>;
  public alias?: string;
  public state: Partial<STATE>;
  private physics?: IEntityPhysics;
  private eventHandlers?: IEntityEventHandlers;
  private tileSize?: number;
  private entityInstances: Array<Entity | ComposedEntity>;

  constructor(idle: ComposedRenderable, alias?: string, tileSize?: number) {
    this.animations = [
      {
        name: 'idle',
        render: idle
      }
    ];
    this.alias = alias;
    this.state = {};
    this.tileSize = tileSize;
    this.entityInstances = [];
  }

  public addAnimation(name: string, render: Sprite) {
    this.animations.push({ name, render });
  }

  public setPhysics(physics: IEntityPhysics) {
    this.physics = physics;
    return this;
  }

  public setEventHandlers(handlers: IEntityEventHandlers) {
    this.eventHandlers = handlers;
    return this;
  }

  public getInstances() {
    return this.entityInstances;
  }

  public hasInstances() {
    return this.getInstances().length > 0;
  }

  public getInstance() {
    const i = this.entityInstances[0];

    if (!i) {
      throw Error('No instances!');
    } else {
      return i;
    }
  }

  public doOnEntity(handler: (e: Entity | ComposedEntity) => void) {
    this.entityInstances.forEach(e => handler(e));
  }

  public createEntity(pos: Position, layer: Layer) {
    if (this.tileSize) {
      // return this.composeEntities(pos, layer);
    }

    const clone = !this.tileSize ?
      (
        new Entity(
          this.animations.find(a => a.name === 'idle')!.render,
          layer,
          pos.x,
          pos.y,
          this.alias
        )
      ) : (
        new ComposedEntity(
          this.animations.find(a => a.name === 'idle')!.render,
          layer,
          pos.x,
          pos.y,
          this.tileSize!,
          this.alias
        )
      )

    clone.state = Object.assign({}, this.state);

    this.animations
      .filter(a => a.name !== 'idle')
      .forEach(ani => clone.addAnimation(ani.name, ani.render));

    if (this.physics) {
      clone.setPhysics(this.physics);
    }

    if (this.eventHandlers) {
      clone.setEventHandlers(this.eventHandlers);
    }

    if (clone instanceof ComposedEntity) {
      clone.addPiecesToLayer();
      console.log(clone);
    } else {
      layer.addEntity(clone);
    }

    this.entityInstances.push(clone);

    return clone;
  }
}
