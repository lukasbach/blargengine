import {IEntityEventHandlers, IEntityPhysics, MoveReason} from "../types";
import {Entity} from "./Entity";
import {EntityCollection} from "./EntityCollection";
import {Position} from "../Position";

export abstract class IMovementPhysics {
  protected readonly movingEntity: Entity;
  protected readonly oldPosition: Position;
  protected readonly newPosition: Position;
  protected readonly relativePosition: Position;
  protected readonly sourceEntity?: Entity;
  protected readonly reason?: MoveReason;

  private _entitiesAffectedByPhysics?: EntityCollection;
  protected get entitiesAffectedByPhysics() {
    return this._entitiesAffectedByPhysics!;
  }

  public constructor(entity: Entity, position: Position, sourceEntity?: Entity, reason?: MoveReason) {
    this.movingEntity = entity;
    this.oldPosition = entity.getPosition();
    this.relativePosition = position;
    this.newPosition = Position.fromSum(this.oldPosition, this.relativePosition);
    this.sourceEntity = sourceEntity;
    this.reason = reason;

    if (entity.physics) {
      this._entitiesAffectedByPhysics = this.getAffectedEntities(entity.physics);
    }
  }

  public canMoveRelative() {
    if (!(!this.movingEntity.eventHandlers || this.canMoveHandlerImpl(this.movingEntity.eventHandlers))) {
      console.log('Move handler revoked')
      return false;
    }

    if (this.sourceEntity === this.movingEntity) {
      return true;
    }

    if (this.entitiesAffectedByPhysics) {
      return this.canMoveRelativeImpl();
    } else {
      return true;
    }
  }

  public applyMoveRelativePhysics() {
    if (this.sourceEntity === this.movingEntity) {
      return;
    }

    if (this.movingEntity.eventHandlers) {
      this.doMoveHandlerImpl(this.movingEntity.eventHandlers);
    }

    if (this.entitiesAffectedByPhysics) {
      this.applyMoveRelativePhysicsImpl();
    } else {
      return;
    }
  }

  protected abstract getAffectedEntities(physics: IEntityPhysics): EntityCollection | undefined;
  protected abstract canMoveRelativeImpl(): boolean;
  protected abstract applyMoveRelativePhysicsImpl(): void;
  protected abstract canMoveHandlerImpl(eventHandlers: IEntityEventHandlers): boolean;
  protected abstract doMoveHandlerImpl(eventHandlers: IEntityEventHandlers): void;
}

export class MovementBlockingPhysics extends IMovementPhysics {
  protected applyMoveRelativePhysicsImpl(): void {
    return;
  }

  protected canMoveRelativeImpl(): boolean {
    return this.entitiesAffectedByPhysics
      .map(item => !item.isAt(this.newPosition))
      .reduce((a, b) => a && b, true);
  }

  protected getAffectedEntities(physics: IEntityPhysics): EntityCollection | undefined {
    return physics.blocking;
  }

  protected canMoveHandlerImpl(eventHandlers: IEntityEventHandlers): boolean {
    return true;
  }

  protected doMoveHandlerImpl(eventHandlers: IEntityEventHandlers) {
    return;
  }
}


export class MovementPushablePhysics extends IMovementPhysics {
  protected applyMoveRelativePhysicsImpl(): void {
    this.entitiesAffectedByPhysics.forEach(item => {
        item.moveRelative(this.relativePosition.getPushPosition(), this.movingEntity, MoveReason.Push);
    });
  }

  protected canMoveRelativeImpl(): boolean {
    let success = true;

    this.entitiesAffectedByPhysics.forEach(item => {
        success = success && item.canMoveRelative(this.relativePosition.getPushPosition(), this.movingEntity, MoveReason.Push);
    });

    return success;
  }

  protected getAffectedEntities(physics: IEntityPhysics): EntityCollection | undefined {
    return physics.pushable && physics.pushable.filter(i => i.isAt(this.newPosition));
  }

  protected canMoveHandlerImpl(eventHandlers: IEntityEventHandlers): boolean {
    if (eventHandlers && eventHandlers.canMove && this.reason === MoveReason.Push) {
      return eventHandlers.canMove(this.oldPosition, this.newPosition, MoveReason.Push);
    } else {
      return true;
    }
  }

  protected doMoveHandlerImpl(eventHandlers: IEntityEventHandlers) {
    if (eventHandlers && eventHandlers.onMove && this.reason === MoveReason.Push) {
      eventHandlers.onMove(this.oldPosition, this.newPosition, MoveReason.Push);
    }
  }
}

export class MovementStickablePhysics extends IMovementPhysics {
  protected applyMoveRelativePhysicsImpl(): void {
    this.entitiesAffectedByPhysics.forEach(item => {
      item.moveRelative(this.relativePosition.getPushPosition(), this.movingEntity, MoveReason.Stick);
    });
  }

  protected canMoveRelativeImpl(): boolean {
    let success = true;

    console.log(this.entitiesAffectedByPhysics, this.entitiesAffectedByPhysics.getAll());

    this.entitiesAffectedByPhysics.forEach(item => {
      success = success && item.canMoveRelative(this.relativePosition.getPushPosition(), this.movingEntity, MoveReason.Stick);
      console.log(success, item);
    });

    return success;
  }

  protected getAffectedEntities(physics: IEntityPhysics): EntityCollection | undefined {
    return physics.sticking && physics.sticking.filter(e => {
      const bySource = !!this.sourceEntity && this.sourceEntity.isAt(e.getPosition());
      const isAdjacent = e.getPosition().isAdjacent(this.oldPosition);
      // console.log(!bySource, isAdjacent, e.getPosition().toString());
      return !bySource && isAdjacent;
    });
  }

  protected canMoveHandlerImpl(eventHandlers: IEntityEventHandlers): boolean {
    if (eventHandlers && eventHandlers.canMove && this.reason === MoveReason.Stick) {
      return eventHandlers.canMove(this.oldPosition, this.newPosition, MoveReason.Stick);
    } else {
      return true;
    }
  }

  protected doMoveHandlerImpl(eventHandlers: IEntityEventHandlers) {
    if (eventHandlers && eventHandlers.onMove && this.reason === MoveReason.Stick) {
      eventHandlers.onMove(this.oldPosition, this.newPosition, MoveReason.Stick);
    }
  }
}

export class MovementDestroyingPhysics extends IMovementPhysics {
  protected applyMoveRelativePhysicsImpl(): void {
    const shouldDestroy = this.entitiesAffectedByPhysics.map(e => true)
      .filter((a, b) => a || b, false);
    console.log(shouldDestroy ? 'Destroy!' : 'No destroy.');
  }

  protected canMoveRelativeImpl(): boolean {
    return true;
  }

  protected getAffectedEntities(physics: IEntityPhysics): EntityCollection | undefined {
    return physics.destroying && physics.destroying.filter(e => e.isAt(this.newPosition));
  }

  protected canMoveHandlerImpl(eventHandlers: IEntityEventHandlers): boolean {
    return true;
  }

  protected doMoveHandlerImpl(eventHandlers: IEntityEventHandlers) {
    // TODO
  }

}

export class MovementEnterablePhysics extends IMovementPhysics {
  protected applyMoveRelativePhysicsImpl(): void {
  }

  protected canMoveRelativeImpl(): boolean {
    return true;
  }

  protected getAffectedEntities(physics: IEntityPhysics): EntityCollection | undefined {
    return physics.handlesEntering && physics.handlesEntering.filter(e => e.isAt(this.newPosition));
  }

  protected canMoveHandlerImpl(eventHandlers: IEntityEventHandlers): boolean {
    return true;
  }

  protected doMoveHandlerImpl(eventHandlers: IEntityEventHandlers) {
    if (eventHandlers.onEnter) {
      eventHandlers.onEnter(this.entitiesAffectedByPhysics.getAll()[0]);
    }
  }

}