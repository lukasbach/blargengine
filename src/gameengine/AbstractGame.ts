import {GameEngine} from "./GameEngine";
import {Entity} from "./Entity";
import {Board} from "./Board";
import {
  IAlias,
  ICanReceiveInput,
  IGameProps,
  IPlayerKeyboardEvent,
  IPlayerMouseClickEvent,
  KeyDefine,
  LevelDefine
} from "./types";
import {Layer} from "./Layer";
import {EntityCollection} from "./EntityCollection";
import {UserInterface} from "./userinterface/UserInterface";
import {ColorPalette} from "./color/ColorPalette";
import {defaultColorPalettes} from "./color/defaultPalettes";
import {Sprite} from "./Sprite";

export interface AbstractGameConstructor {
  new (engine: GameEngine): AbstractGame;
}

export abstract class AbstractGame implements ICanReceiveInput {
  private _board?: Board;
  private aliases: IAlias[];

  public set board(board: Board) {
    this._board = board;
  }
  public get board() {
    if (!this._board) {
      throw Error('Board not defined.');
    }
    return this._board;
  }

  public nextTickFlag: boolean;
  private engine: GameEngine;

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.nextTickFlag = false;
    this.aliases = [];

    this.sprites = {};
  }

  public gameprops: IGameProps = {
    tileSize: 5,
    pixelSize: 6
  };

  public state: object = {};
  protected defaultColorPalettes = defaultColorPalettes;
  protected colorPalette: ColorPalette<any> = defaultColorPalettes['pollen8'];
  public backgroundColor: string = this.colorPalette.getBackgroundColor().color;

  protected abstract spriteDefinitions: { [key: string]: string[] };
  protected sprites: { [key: string]: Sprite };

  defineLevels(defineLevel: LevelDefine) {}
  defineKeyMapping(defineKey: KeyDefine) {}
  onInitLevel() {}

  onMovement() {}
  onTick() {}
  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent) {}

  checkLevelWin() {}

  renderBottomLegend(): UserInterface | undefined {
    return undefined;
  }

  public createEntityCollection(...items: (string | Layer | Entity)[]) {
    const resolveAlias = (alias: string) => {
      const entities: Entity[] = [];

      for (const a of this.aliases) {
        if (a.name === alias) {
          if (a.refersTo instanceof Entity) {
            entities.push(a.refersTo);
          } else if (a.refersTo instanceof Layer) {
            entities.push(...a.refersTo.entities);
          }
        }
      }

      return entities;
    };

    return new EntityCollection(resolveAlias, ...items);
  }

  public createAlias(name: string, refersTo: Entity | Layer) {
    this.aliases.push({ name, refersTo });
  }

  public resolveEntityAlias(name: string): Entity {
    const e = this.aliases.find(a => a.name === name);

    if (!e || !(e.refersTo instanceof Entity)) {
      throw Error('Err!');
    } else {
      return e.refersTo;
    }
  }

  public resolveLayerAlias(name: string): Layer {
    const e = this.aliases.find(a => a.name === name);

    if (!e || !(e.refersTo instanceof Layer)) {
      throw Error('Err!');
    } else {
      return e.refersTo;
    }
  }

  public resolveAlias(name: string): Layer | Entity {
    const e = this.aliases.find(a => a.name === name);

    if (!e) {
      throw Error('Err!');
    } else {
      return e.refersTo;
    }
  }

  public prepareSprites() {
    this.sprites = {};
    for (let key of Object.keys(this.spriteDefinitions)) {
      this.sprites[key] = new Sprite(this.colorPalette.getColors(), this.spriteDefinitions[key]);
    }
  }

  protected nextTick() {
    this.nextTickFlag = true;
  }

  protected getEntity(alias: string): Entity {
    const entity = this.board.findEntityFromAlias(alias);
    if (!entity) {
      throw Error(`Could not find entitiy with alias ${alias}`);
    }
    return entity;
  }


}
