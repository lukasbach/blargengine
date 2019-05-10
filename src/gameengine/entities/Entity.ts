import {RenderContext} from "../RenderContext";
import {
  IEntityEventHandlers,
  IEntityPhysics,
  IPlayerKeyboardEvent,
  IPlayerMouseClickEvent,
  ISerializedPosition,
  ITimeTravelable,
  MoveReason
} from "../types";
import {Renderable} from "../Renderable";
import {Layer} from "../Layer";
import {Position} from "../Position";
import {TimeBox} from "../TimeBox";
import {
  IMovementPhysics,
  MovementBlockingPhysics,
  MovementDestroyingPhysics, MovementEnterablePhysics,
  MovementPushablePhysics,
  MovementStickablePhysics
} from "./MovementPhysics";

export class Entity<STATE = {}> implements ITimeTravelable, Renderable {
  public readonly alias?: string;
  public state: Partial<STATE>;

  private layer: Layer;
  private pos: Position;
  private animationState: string;
  public physics?: IEntityPhysics;
  public eventHandlers?: IEntityEventHandlers;
  private animations: Array<{
    name: string;
    render: Renderable;
  }>;
  private timeBox: TimeBox<{
    state: Partial<STATE>,
    pos: Position,
    animationState: string;
  }>;

  constructor(idle: Renderable, layer: Layer, x: number, y: number, alias?: string) {
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

  public destroy() {
    this.layer.removeEntity(this);
  }

  public addAnimation(name: string, render: Renderable) {
    this.animations.push({ name, render });
  }

  public setAnimationState(name: string) {
    this.animationState = name;
  }

  public setPhysics(physics: IEntityPhysics) {
    this.physics = physics;
    return this;
  }

  public setEventHandlers(handlers: IEntityEventHandlers) {
    this.eventHandlers = handlers;
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

  public canMoveRelative(position: ISerializedPosition, sourceEntity?: Entity, reason?: MoveReason): boolean {
    return this.getMovementPhysics(Position.fromPosition(position), sourceEntity, reason)
      .map(ph => {const can = ph.canMoveRelative();/*console.log(ph, can);*/return can;})
      .reduce((a, b) => a && b, true);
  }

  public moveRelative(position: ISerializedPosition, sourceEntity?: Entity, reason?: MoveReason): boolean {
    if (this.canMoveRelative(position, sourceEntity, reason)) {
      if (this.eventHandlers && this.eventHandlers.onMove && reason === MoveReason.UserInput) {
        this.eventHandlers.onMove(this.pos, Position.fromSum(this.pos, position), reason || MoveReason.Other);
      }

      if (reason !== MoveReason.Internal/* && reason !== MoveReason.Composed*/) {
        this.getMovementPhysics(Position.fromPosition(position), sourceEntity, reason)
          .forEach(ph => ph.applyMoveRelativePhysics());
      }

      this.pos = Position.fromSum(this.pos, position);

      return true;
    } else {
      return false;
    }
  }

  public render(renderContext: RenderContext): void {
    // renderContext.drawBlockCoords(this.pos);
    this.getAnimation().render.render(renderContext.withOffset(this.pos));
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

  private getMovementPhysics(position: Position, sourceEntity?: Entity, reason?: MoveReason): IMovementPhysics[] {
    return [
      new MovementBlockingPhysics(this, position, sourceEntity, reason),
      new MovementPushablePhysics(this, position, sourceEntity, reason),
      new MovementStickablePhysics(this, position, sourceEntity, reason),
      new MovementDestroyingPhysics(this, position, sourceEntity, reason),
      new MovementEnterablePhysics(this, position, sourceEntity, reason)
    ];
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
