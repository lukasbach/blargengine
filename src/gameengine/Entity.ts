import {RenderContext} from "./RenderContext";
import {
  IEntityPhysics,
  IPlayerKeyboardEvent,
  IPlayerMouseClickEvent,
  ISerializedPosition,
  ITimeTravelable
} from "./types";
import {Renderable, RenderableAt} from "./Renderable";
import {Layer} from "./Layer";
import {Position} from "./Position";
import {TimeBox} from "./TimeBox";

export class Entity<STATE = {}> implements ITimeTravelable, Renderable {
  public readonly alias?: string;
  public state: Partial<STATE>;

  private layer: Layer;
  private pos: Position;
  private animationState: string;
  private physics?: IEntityPhysics;
  private animations: Array<{
    name: string;
    render: RenderableAt;
  }>;
  private timeBox: TimeBox<{
    state: Partial<STATE>,
    pos: Position,
    animationState: string;
  }>;

  constructor(idle: RenderableAt, layer: Layer, x: number, y: number, alias?: string) {
    this.animations = [
      {
        name: 'idle',
        render: idle
      }
    ];

    this.animationState = 'idle';
    this.pos = new Position(x, y, 0, 0);
    this.layer = layer;
    this.alias = alias;
    this.state = {};
    this.timeBox = new TimeBox();
  }

  public addAnimation(name: string, render: RenderableAt) {
    this.animations.push({ name, render });
  }

  public setAnimationState(name: string) {
    this.animationState = name;
  }

  public setPhysics(physics: IEntityPhysics) {
    this.physics = physics;
  }

  public isAt(p: ISerializedPosition) {
    return !!this.pos && p.x === this.pos.x && p.y === this.pos.y;
  }

  public getPosition() {
    if (!this.pos) {
      throw Error('Cant get position of unpositioned entity.');
    }
    return this.pos;
  }

  public moveRelative(position: ISerializedPosition, sourceEntity?: Entity): boolean {
    let newPosition = Position.fromSum(this.pos, position);
    let canMove;

    [canMove, newPosition] = this.moveRespectBlockingPhysics(this.pos, newPosition);
    if (!canMove) return false;

    [canMove, newPosition] = this.moveRespectStickablePhysics(this.pos, newPosition, Position.fromPosition(position), sourceEntity);
    if (!canMove) return false;

    [canMove, newPosition] = this.moveRespectPushablePhysics(this.pos, newPosition, Position.fromPosition(position));
    if (!canMove) return false;

    [canMove, newPosition] = this.moveRespectDestroyablePhysics(newPosition);
    if (!canMove) return false;

    this.pos = newPosition;
    return true;
  }

  public render(renderContext: RenderContext): void {
    if (!this.pos) {
      throw Error('Cant render unpositioned entity.');
    }
    this.getAnimation().render.renderAt(renderContext, this.pos);
  }

  public clone(to?: ISerializedPosition) {
    const clone = new Entity(
      this.animations.find(a => a.name !== 'idle')!.render,
      this.layer,
      to ? to.x : this.pos.x,
      to ? to.y : this.pos.y,
      this.alias
    );

    clone.state = Object.assign({}, this.state);

    this.animations
      .filter(a => a.name !== 'idle')
      .forEach(ani => clone.addAnimation(ani.name, ani.render));

    return clone;
  }

  public hookToMovement(e: IPlayerMouseClickEvent | IPlayerKeyboardEvent, onMoved: () => void) {
    if (e.type === "keypressed") {
      switch(e.keyname) {
        case 'up':
          this.moveRelative({ x: 0, y: -1 });
          onMoved();
          break;
        case 'down':
          this.moveRelative({ x: 0, y: 1 });
          onMoved();
          break;
        case 'left':
          this.moveRelative({ x: -1, y: 0 });
          onMoved();
          break;
        case 'right':
          this.moveRelative({ x: 1, y: 0 });
          onMoved();
          break;
      }
    }
  }

  private getAnimation() {
    const ani = this.animations.find(a => a.name === this.animationState);
    if (!ani) {
      throw Error(`Entity can not render animation ${this.animationState}, `
        + `it is not defined.`);
    } else {
      return ani;
    }
  }

  private moveRespectBlockingPhysics(oldPosition: Position, newPosition: Position): [boolean, Position] {
    if (this.physics && this.physics.blocking) {
      const canMove = this.physics.blocking.map(item => !item.isAt(newPosition)).reduce((a, b) => a && b, true);
      return [canMove, canMove ? newPosition : oldPosition];
    }
    return [true, newPosition];
  }

  private moveRespectPushablePhysics(oldPosition: Position, newPosition: Position, relativePosition: Position): [boolean, Position] {
    if (this.physics && this.physics.pushable) {

      let success = true;

      this.physics.pushable.forEach(item => {
        if (item.isAt(newPosition)) {
          success = success && item.moveRelative(relativePosition.getPushPosition());
        }
      });

      return [success, success ? newPosition : oldPosition];
    }
    return [true, newPosition];
  }

  private moveRespectStickablePhysics(
    oldPosition: Position,
    newPosition: Position,
    relativePosition: Position,
    sourceEntity?: Entity
  ): [boolean, Position] {
    if (this.physics && this.physics.sticking) {

      let success = true;

      this.physics.sticking.forEach(item => {
        if (item.getPosition().isAdjacent(oldPosition) && (!sourceEntity || !sourceEntity.isAt(item.getPosition()))) {
          success = success && item.moveRelative(relativePosition.getPushPosition(), this);
        }
      });

      return [success, success ? newPosition : oldPosition];
    }
    return [true, newPosition];
  }

  private moveRespectDestroyablePhysics(
    newPosition: Position,
  ): [boolean, Position] {
    if (this.physics && this.physics.destroying) {
      this.physics.destroying.forEach(item => {
        if (item.isAt(newPosition)) {
          console.log('destroy self!')
          return [true, newPosition];
        }
      });
    }
    return [true, newPosition];
  }

  goBack(): void {
    const {state, pos, animationState} = this.timeBox.popStep();
    this.state = state;
    this.pos = pos;
    this.animationState = animationState;
  }

  storeStep(): void {
    this.timeBox.storeStep({
      state: Object.assign({}, this.state),
      pos: this.pos.clone(),
      animationState: this.animationState
    });
  }
}
