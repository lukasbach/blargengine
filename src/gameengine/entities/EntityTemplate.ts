import {Entity} from "./Entity";
import {Layer} from "../Layer";
import {IEntityEventHandlers, IEntityPhysics, ISerializedPosition} from "../types";
import {RenderableAt} from "../Renderable";
import {Sprite} from "../Sprite";
import {Position} from "../Position";
import {ComposedEntity} from "./ComposedEntity";

export class EntityTemplate<STATE = {}> {
  private animations: Array<{
    name: string;
    render: Sprite;
  }>;
  public alias?: string;
  public state: Partial<STATE>;
  private physics?: IEntityPhysics;
  private eventHandlers?: IEntityEventHandlers;
  private tileSize?: number;

  constructor(idle: Sprite, alias?: string, tileSize?: number) {
    this.animations = [
      {
        name: 'idle',
        render: idle
      }
    ];
    this.alias = alias;
    this.state = {};
    this.tileSize = tileSize;
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

  public createEntity(pos: ISerializedPosition, layer: Layer) {
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

    return clone;
  }

  private composeEntities(pos: ISerializedPosition, layer: Layer) {
    const idle = this.animations.find(a => a.name === 'idle')!.render;
    const idleSubSprites = idle.getSubSprites(this.tileSize!);

    console.log(idleSubSprites);

    const pieces = idleSubSprites.map((subSprite, idx) => {
      const isMasterEntity = idx === 0;

      const entity = new Entity(
        subSprite.sprite,
        layer,
        pos.x + subSprite.x,
        pos.y + subSprite.y,
        this.alias
      );


      // TODO animations

      entity.setEventHandlers({
        ...(this.eventHandlers || {}),
        onMove: (from, to) => {

          const relative = Position.fromDifference(to, from);
          pieces.filter((e, i) => i !== idx).forEach(p => p.moveRelative(relative, entity));
          return true;
        }
      });

      if (this.physics) {
        entity.setPhysics(this.physics);
      }

      return entity;
    });

    pieces.slice(1).forEach(p => layer.addEntity(p));

    return pieces[0];
  }
}
