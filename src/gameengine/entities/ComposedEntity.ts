import {IEntityEventHandlers, IEntityPhysics, ITimeTravelable, MoveReason} from "../types";
import {Renderable, RenderableAt} from "../Renderable";
import {RenderContext} from "../RenderContext";
import {Layer} from "../Layer";
import {Position} from "../Position";
import {TimeBox} from "../TimeBox";
import {Entity} from "./Entity";
import {Sprite} from "../Sprite";

interface IPieceInformation {
  entity: Entity;
  relativePosition: Position
}

export class ComposedEntity<STATE = {}> implements ITimeTravelable, Renderable {
  public readonly alias?: string;
  public state: Partial<STATE>;

  private pieces: IPieceInformation[];
  private layer: Layer;
  private physics?: IEntityPhysics;
  public eventHandlers?: IEntityEventHandlers;
  private animations: Array<{
    name: string;
    render: RenderableAt;
  }>;
  private timeBox: TimeBox<{
    state: Partial<STATE>;
  }>;

  constructor(idle: Sprite, layer: Layer, x: number, y: number, tileSize: number, alias?: string) {
    this.animations = [
      {
        name: 'idle',
        render: idle
      }
    ];

    this.layer = layer;
    this.alias = alias;
    this.state = {};
    this.timeBox = new TimeBox();

    this.pieces = idle.getSubSprites(tileSize).map(piece => {
      const entity = new Entity(piece.sprite, layer, piece.x + x, piece.y + y, alias);

      return {
        entity: entity,
        relativePosition: new Position(piece.x, piece.y)
      };
    });

    this.preparePieces();
  }

  render(renderContext: RenderContext): void {
    this.pieces.forEach(piece => {
      piece.entity.render(renderContext.withOffset(piece.relativePosition))
    });
  }

  storeStep(): void {
    this.timeBox.storeStep({ state: this.state });
    this.pieces.forEach(piece => piece.entity.storeStep());
  }

  goBack(): void {
    this.state = this.timeBox.popStep().state;
    this.pieces.forEach(piece => piece.entity.goBack());
  }

  public setPhysics(physics: IEntityPhysics) {
    this.physics = physics;
    for (const piece of this.pieces) {
      piece.entity.setPhysics(physics);
    }
    return this;
  }

  public addAnimation(name: string, render: RenderableAt) {
    this.animations.push({ name, render });
  }

  public setEventHandlers(handlers: IEntityEventHandlers) {
    this.eventHandlers = handlers;
  }

  public addPiecesToLayer() {
    this.pieces.forEach(piece => this.layer.addEntity(piece.entity));
  }

  private preparePieces() {
    for (const piece of this.pieces) {
      if (this.physics) {
        piece.entity.setPhysics(this.physics);
      }

      piece.entity.setEventHandlers({
        canMove: (from, to, reason) => {
          if (reason !== MoveReason.Push) return false;

          const relMovement = Position.fromDifference(to, from);
          let success = true;

          if (this.eventHandlers && this.eventHandlers.canMove) {
            // success = success && this.eventHandlers.canMove(from, to, MoveReason.Composed);
          }

          if (!success) return false;

          success = success && this.pieces
            .map(p => p.entity.canMoveRelative(relMovement, piece.entity, MoveReason.Composed))
            .reduce((a, b) => a && b, true);

          return success;
        },
        onMove: (from, to, reason) => {
          if (reason !== MoveReason.Push) return;
          console.log("on move piece");

          const relMovement = Position.fromDifference(to, from);
          let success = true;

          if (this.eventHandlers && this.eventHandlers.onMove) {
            // this.eventHandlers.onMove(from, to, MoveReason.Composed);
          }

          for (let otherPiece of this.pieces) {
            if (!otherPiece.relativePosition.equals(piece.relativePosition)) {
              otherPiece.entity.moveRelative(relMovement, piece.entity, MoveReason.Composed);
            }
          }

          return success;
        }
      })
    }
  }

}