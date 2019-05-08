import {Level} from "./Level";
import {Layer} from "./Layer";
import {Entity} from "./Entity";
import {EntityCollection} from "./EntityCollection";
import {Position} from "./Position";

export interface IPlayerMouseClickEvent {
  type: 'mouseclick',
  tile: ISerializedPosition,
  x: number,
  y: number
}

export interface IPlayerKeyboardEvent {
  type: 'keypressed' | 'keydown' | 'keyup',
  keyname: string
}

export interface ISerializedPosition {
  x: number;
  y: number;
  xOffset?: number;
  yOffset?: number;
}

export interface ISpriteData {
  lines: Array<{
    cells: Array<{
      color: string;
    }>
  }>
}

export type Color = string | number;

export type KeyDefine = (keyId: string, keyName: string, description: string, defaultKey: string) => void;
export type LevelDefine = (level: Level) => Level;

export interface IGameProps {
  tileSize: number,
  pixelSize: number
}

export interface IAlias {
  name: string;
  refersTo: Entity | Layer;
}

export interface IEntityPhysics {
  blocking?: EntityCollection;
  pushable?: EntityCollection;
  pushLimit?: number;
  sticking?: EntityCollection;
  stickLimit?: number;
  destroying?: EntityCollection;
  handlesEntering?: EntityCollection;
}

// export type MoveReason = 'userinput' | 'push' | 'stick' | 'internal' | 'other' | 'composed';
export enum MoveReason {
  UserInput,
  Push,
  Stick,
  Composed,
  Internal,
  Other
}

export interface IEntityEventHandlers {
  onMove?: (from: Position, to: Position, reason: MoveReason) => boolean;
  onPush?: (from: Position, to: Position) => boolean;
  onStickAlong?: (from: Position, to: Position) => boolean;
  onDestroy?: () => boolean;
  onKey?: (key: string) => void;
  onClick?: () => void;
  onEnter?: (entity: Entity) => void;
}

export interface ITimeTravelable {
  goBack(): void;
  storeStep(): void;
}

export interface ICanReceiveInput {
  onInput?(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent): void;
}

export interface IColor<ALIASES extends string = string> {
  color: string;
  alias: ALIASES;
  type?: 'primary' | 'secondary' | 'background' | 'border'
}