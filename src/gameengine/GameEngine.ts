import {CanvasRenderContext, MeasureRenderContext, RenderContext} from "./RenderContext";
import {AbstractGame, AbstractGameConstructor} from "./AbstractGame";
import {Level} from "./Level";
import {Position} from "./Position";
import {UserInterface} from "./UserInterface";
import {ICanReceiveInput} from "./types";
import {MenuComponent} from "./MenuComponent";
import {FloatingRender} from "./FloatingRender";

export interface IKeyMapping {
  keyId: string;
  keyName: string;
  description: string;
  defaultKey: string;
  key: string;
  target: ICanReceiveInput;
}

interface ILegendRenderInformation {
  ui: UserInterface,
  x: number,
  y: number,
  width: number,
  height: number
}

export class GameEngine {
  private container: HTMLElement;
  private canvasElement: HTMLCanvasElement;
  private canvas: CanvasRenderingContext2D;
  private game: AbstractGame;
  private openMenu?: UserInterface;
  private levels: Level[];
  private levelIndex: number;
  private keyMapping: IKeyMapping[];
  private legends: {
    bottom?: ILegendRenderInformation;
  };

  constructor(container: HTMLElement, Game: AbstractGameConstructor) {
    const canvasStyle = `
      image-rendering: -moz-crisp-edges;
      image-rendering: -webkit-crisp-edges;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    `;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', canvasStyle);
    canvas.setAttribute('width', container.clientWidth + '');
    canvas.setAttribute('height', container.clientHeight + '');
    container.appendChild(canvas);

    if ((window as any).ResizeObserver) {
      new (window as any).ResizeObserver(() => {
        console.log(container.clientWidth)
        canvas.setAttribute('width', container.clientWidth + '');
        canvas.setAttribute('height', container.clientHeight + '');
        this.nextTick();
      }).observe(container);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw Error('Could not get Canvas Context');
    }

    this.canvas = ctx;
    this.canvasElement = canvas;
    this.container = container;
    this.game = new Game(this);
    this.keyMapping = [];
    this.levels = [];
    this.levelIndex = 0;
    this.legends = {};

    MeasureRenderContext.setGameProps(this.game.gameprops);

    this.game.defineLevels(level => {
      this.levels.push(level);
      return level;
    });

    this.game.defineKeyMapping((keyId, keyName, description, defaultKey) => {
      this.keyMapping.push({ keyId, keyName, description, defaultKey, key: defaultKey, target: this.game });
    });

    this.keyMapping.push({
      keyId: 'menu',
      keyName: 'Menu',
      description: 'Open the game menu',
      defaultKey: 'escape',
      key: 'escape',
      target: new MenuComponent(ui => this.openMenu = ui, () => this.openMenu = undefined, () => this.nextTick())
    });

    this.registerUserEvents();

    this.initializeLevel();
    this.redrawScene();
  }

  private initializeLevel() {
    this.game.board = this.currentLevel.createBoard(
      alias => this.game.createAlias(alias.name, alias.refersTo)
    );

    this.game.onInitLevel();
  }

  private get currentLevel() {
    return this.levels[this.levelIndex];
  }

  private createRenderContext(): RenderContext {
    return new CanvasRenderContext(this.canvas, this.canvasElement, this.game.gameprops);
  }

  private createMeasurementRenderContext(): MeasureRenderContext {
    return new MeasureRenderContext();
  }

  private registerUserEvents() {
    document.addEventListener('keydown', ev => {
      ev.preventDefault();
      ev.stopPropagation();

      const mapping = this.keyMapping.find(m => {
        return m.key.toLocaleLowerCase() === ev.key.toLocaleLowerCase()
      });

      if (mapping && mapping.target.onInput) {
        mapping.target.onInput({
          type: "keypressed",
          keyname: mapping.keyId
        });
      }

      this.checkNextTickFlag();
    });


    this.canvasElement.addEventListener("click", ev => {
      const [clickX, clickY] = [ev.offsetX / this.game.gameprops.pixelSize, ev.offsetY / this.game.gameprops.pixelSize];

      if (this.legends.bottom) {
        const {x, y, width, height, ui} = this.legends.bottom;
        if (clickX > x && clickX < x + width && clickY > y && clickY < y + height) {
          ui.onInput({
            type: "mouseclick",
            tile: new Position(0, 0),
            x: clickX - x,
            y: clickY - y
          });
        }
      }
    })
  }

  private nextTick() {
    this.redrawScene();
  }

  private checkNextTickFlag() {
    if (this.game.nextTickFlag) {
      this.nextTick();
      this.game.nextTickFlag = false;
    }
  }

  private redrawScene() {
    this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.game.board.render(this.createRenderContext());

    this.renderBottomLegend();

    if (this.openMenu) {
      FloatingRender.floatRender(this.openMenu, this.createRenderContext(), "center", "center");
    }
  }

  private renderBottomLegend() {
    const bottomLegend = this.game.renderBottomLegend();

    if (bottomLegend) {
      const res = FloatingRender.floatRender(
        bottomLegend, this.createRenderContext(), "bottom", "center");

      this.legends.bottom = {...res, ui: bottomLegend};

      /*const measure = this.createMeasurementRenderContext();
      const renderCtx = this.createRenderContext();

      bottomLegend.render(measure);

      const {right, bottom} = measure.getMeasurements();

      const x = renderCtx.width / 2 - right / 2;
      const y = renderCtx.height - bottom - 2;

      this.legends.bottom = {
        ui: bottomLegend,
        x, y, width: right, height: bottom
      };

      bottomLegend.render(this.createRenderContext().withOffset(new Position(0, 0, x, y)));*/
    }
  }
}