import {Level} from "./Level";
import {Layer} from "./Layer";
import {Entity} from "./Entity";
import {EntityCollection} from "./EntityCollection";

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
}

export interface ITimeTravelable {
  goBack(): void;
  storeStep(): void;
}

export interface ICanReceiveInput {
  onInput?(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent): void;
}