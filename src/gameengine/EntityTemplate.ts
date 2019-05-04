import {Entity} from "./Entity";
import {Layer} from "./Layer";
import {IEntityPhysics, ISerializedPosition} from "./types";
import {RenderableAt} from "./Renderable";

export class EntityTemplate<STATE = {}> {
  private animations: Array<{
    name: string;
    render: RenderableAt;
  }>;
  public alias?: string;
  public state: Partial<STATE>;
  private physics?: IEntityPhysics;

  constructor(idle: RenderableAt, alias?: string) {
    this.animations = [
      {
        name: 'idle',
        render: idle
      }
    ];
    this.alias = alias;
    this.state = {};
  }

  public addAnimation(name: string, render: RenderableAt) {
    this.animations.push({ name, render });
  }

  public setPhysics(physics: IEntityPhysics) {
    this.physics = physics;
  }

  public withPhysics(physics: IEntityPhysics): EntityTemplate<STATE> {
    this.setPhysics(physics);
    return this;
  }

  public createEntity(pos: ISerializedPosition, layer: Layer) {
    const clone = new Entity(
      this.animations.find(a => a.name === 'idle')!.render,
      layer,
      pos.x,
      pos.y,
      this.alias
    );

    clone.state = Object.assign({}, this.state);

    this.animations
      .filter(a => a.name !== 'idle')
      .forEach(ani => clone.addAnimation(ani.name, ani.render));

    if (this.physics) {
      clone.setPhysics(this.physics);
    }

    return clone;
  }
}
