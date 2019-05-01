import {GameEngine} from "./GameEngine";

export interface AbstractGameConstructor {
  new (engine: GameEngine): AbstractGame;
}

export abstract class AbstractGame {
  private _board?: Board;

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
  }

  public gameprops: IGameProps = {
    tileSize: 5,
    pixelSize: 2
  };

  state: object = {};

  defineLevels(defineLevel: LevelDefine) {}
  defineKeyMapping(defineKey: KeyDefine) {}
  onInitLevel() {}

  onMovement() {}
  onTick() {}
  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent) {}

  checkLevelWin() {}

  renderBottomLegend() {}

  protected nextTick() {
    this.nextTickFlag = true;
  }

  protected getEntity(alias: string): Entity | undefined {
    return this.board.findEntityFromAlias(alias);
  }

}

export type KeyDefine = (keyId: string, keyName: string, description: string, defaultKey: string) => void;
export type LevelDefine = (level: Level) => Level;


export interface IGameProps {
  tileSize: number,
  pixelSize: number
}

export type Color = string | number;

export const getColorCode = (color: Color): string => {
  return typeof color === "string" ? color : '' + color; // TODO
};

export interface ISpriteData {
  lines: Array<{
    cells: Array<{
      color: string;
    }>
  }>
}

export abstract class Renderable {
  public abstract render(renderContext: RenderContext): void;
}

export abstract class RenderableAt {
  public abstract renderAt(renderContext: RenderContext, position: IPosition): void;
}

export class Sprite extends RenderableAt {
  private readonly data: ISpriteData;

  constructor(colors: Color[], lines: string[]) {
    super();

    this.data = {
      lines: lines.map(l => ({
        cells: l.split('').map(c => ({
          color: this.getColorFromChar(colors, c)
        }))
      }))
    }
  }

  public getData(): ISpriteData {
    return this.data;
  }

  private getColorFromChar(colors: Color[], char: string) {
    return getColorCode(colors[char.charCodeAt(0) - 97] || colors[parseInt(char)]);
  }

  public renderAt(renderContext: RenderContext, position: IPosition): void {
    this.data.lines.forEach((line, lineIndex) => {
      line.cells.forEach((cell, cellIndex) => {
        renderContext.drawPixel({
          x: position.x,
          y: position.y,
          xOffset: cellIndex,
          yOffset: lineIndex
        }, cell.color);
      })
    })
  }
}

export class SpriteAnimation extends RenderableAt {
  private frames: Sprite[];
  private timePerFrame: number = 5;

  constructor(frames: Sprite[], timePerFrame: number = 5) {
    super();

    this.frames = frames;
    this.timePerFrame = timePerFrame;
  }

  public renderAt(renderContext: RenderContext, position: IPosition): void {
  }
}

export interface IPosition {
  x: number;
  y: number;
  xOffset?: number;
  yOffset?: number;
}

export class EntityTemplate {
  private animations: Array<{
    name: string;
    render: RenderableAt;
  }>;
  private alias?: string;

  constructor(idle: RenderableAt, alias?: string) {
    this.animations = [
      {
        name: 'idle',
        render: idle
      }
    ];
    this.alias = alias;
  }

  public addAnimation(name: string, render: RenderableAt) {
    this.animations.push({ name, render });
  }

  public createEntity(pos: IPosition, layer: Layer) {
    const clone = new Entity(
      this.animations.find(a => a.name === 'idle')!.render,
      layer,
      pos.x,
      pos.y,
      this.alias
    );

    this.animations
      .filter(a => a.name !== 'idle')
      .forEach(ani => clone.addAnimation(ani.name, ani.render));

    return clone;
  }
}

export class Entity extends Renderable {
  private layer: Layer;

  private pos: IPosition;

  private animations: Array<{
    name: string;
    render: RenderableAt;
  }>;

  private animationState: string;

  public readonly alias?: string;

  constructor(idle: RenderableAt, layer: Layer, x: number, y: number, alias?: string) {
    super();

    this.animations = [
      {
        name: 'idle',
        render: idle
      }
    ];

    this.animationState = 'idle';
    this.pos = { x, y, xOffset: 0, yOffset: 0 };
    this.layer = layer;
    this.alias = alias;
  }

  public addAnimation(name: string, render: RenderableAt) {
    this.animations.push({ name, render });
  }

  public setAnimationState(name: string) {
    this.animationState = name;
  }

  public isAt(p: IPosition) {
    return !!this.pos && p.x === this.pos.x && p.y === this.pos.y;
  }

  public getPosition() {
    if (!this.pos) {
      throw Error('Cant get position of unpositioned entity.');
    }
    return this.pos;
  }

  public moveRelative(position: IPosition) {
    this.pos = {
      x: this.pos.x + position.x,
      y: this.pos.y + position.y,
      xOffset: (this.pos.xOffset || 0) + (position.xOffset || 0),
      yOffset: (this.pos.yOffset || 0) + (position.yOffset || 0)
    }
  }

  public render(renderContext: RenderContext): void {
    if (!this.pos) {
      throw Error('Cant render unpositioned entity.');
    }
    this.getAnimation().render.renderAt(renderContext, this.pos);
  }

  public clone(to?: IPosition) {
    const clone = new Entity(
      this.animations.find(a => a.name !== 'idle')!.render,
      this.layer,
      to ? to.x : this.pos.x,
      to ? to.y : this.pos.y,
      this.alias
    );

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
}

export class Layer extends Renderable {
  entities: Entity[];

  constructor() {
    super();

    this.entities = []
  }

  addEntity(e: Entity, onlyIfEmpty?: boolean) {
    if (!onlyIfEmpty || !this.getAt(e.getPosition())) {
      this.entities.push(e);
    }
  }

  getAt(p: IPosition) {
    return this.entities.find(e => e.isAt(p));
  }

  public render(renderContext: RenderContext) {
    for (const e of this.entities) {
      e.render(renderContext);
    }
  }

  public findFromAlias(alias: string) {
    return this.entities.find(e => e.alias === alias);
  };
}

export class Board extends Renderable {
  private layers: Layer[];
  private layerAliases: string[];

  constructor() {
    super();
    this.layers = [];
    this.layerAliases = [];
  }

  public newLayer(alias?: string): Layer {
    const l = new Layer();
    this.layers.push(l);
    this.layerAliases.push(alias || `Layer ${this.layers.length}`);
    return l;
  }

  public getLayer(id: string | number): Layer {
    if (typeof id === "string") {
      this.layerAliases.forEach((alias, idx) => {
        if (alias === id) {
          id = idx;
        }
      });
    }

    const layer = this.layers[id as number];

    if (!layer) {
      throw Error('Could not find layer.');
    } else {
      return layer;
    }
  }

  public render(renderContext: RenderContext) {
    for (const l of this.layers) {
      l.render(renderContext);
    }
  }

  public findEntityFromAlias(alias: string) {
    for (const layer of this.layers) {
      const entity = layer.findFromAlias(alias);
      if (entity) {
        return entity;
      }
    }
    return undefined;
  }
}

export class Level {
  private readonly legend: Array<{ id: string, entity: EntityTemplate, layer: string }>;
  private readonly map: string[];

  constructor(
    legend: Array<{ id: string, entity: EntityTemplate, layer: string }>,
    map: string[]
  ) {
    this.legend = legend;
    this.map = map;
  }

  public createBoard(): Board {
    const board = new Board();

    // Create layers
    const layerNames: string[] = [];
    for (const item of this.legend) {
      if (!layerNames.includes(item.layer)) {
        layerNames.push(item.layer);
        board.newLayer(item.layer)
      }
    }

    let x = 0;
    let y = 0;

    for (const line of this.map) {
      for (const cell of line.split('')) {
        const legendEntry = this.legend.find(e => e.id === cell);

        if (!legendEntry) {
          throw Error('Could not find legend entry.');
        }

        const layer = board.getLayer(legendEntry.layer);
        layer.addEntity(legendEntry.entity.createEntity({ x, y }, layer));

        x++;
      }

      y++;
      x = 0;
    }

    console.log(board);

    return board;
  }
}

export interface IPlayerMouseClickEvent {
  type: 'mouseclick',
  tile: IPosition
}

export interface IPlayerKeyboardEvent {
  type: 'keypressed' | 'keydown' | 'keyup',
  keyname: string
}

export class RenderContext {
  private readonly canvas: CanvasRenderingContext2D;
  private readonly props: IGameProps;
  private offset: IPosition;

  get pixelSize() {
    return this.props.pixelSize;
  }

  get tileSize() {
    return this.props.tileSize;
  }

  constructor(canvas: CanvasRenderingContext2D, props: IGameProps, offset?: IPosition) {
    this.canvas = canvas;
    this.props = props;
    this.offset = offset || { x: 0, y: 0 };
  }

  withOffset(offset: IPosition): RenderContext {
    return new RenderContext(this.canvas, this.props, {
      x: this.offset.x + offset.x,
      y: this.offset.y + offset.y,
      xOffset: this.offset.xOffset && offset.xOffset
        ? (this.offset.xOffset || 0) + (offset.xOffset || 0) : undefined,
      yOffset: this.offset.yOffset && offset.yOffset
        ? (this.offset.yOffset || 0) + (offset.yOffset || 0) : undefined
    });
  }

  drawPixel(position: IPosition, color: string) {
    const { pixelSize, tileSize } = this.props;

    this.canvas.fillStyle = color;
    this.canvas.fillRect(
      (this.offset.x + position.x) * tileSize * pixelSize + ((this.offset.xOffset || 0) + (position.xOffset || 0)) * pixelSize,
      (this.offset.y + position.y) * tileSize * pixelSize + ((this.offset.yOffset || 0) + (position.yOffset || 0)) * pixelSize,
      pixelSize,
      pixelSize,
    );
  }
}
