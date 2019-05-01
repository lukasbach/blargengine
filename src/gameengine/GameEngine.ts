import {AbstractGame, AbstractGameConstructor, Board, Level, RenderContext} from "./AbstractGame";

export interface IKeyMapping {
  keyId: string;
  keyName: string;
  description: string;
  defaultKey: string;
  key: string;
}

export class GameEngine {
  private container: HTMLElement;
  private canvasElement: HTMLCanvasElement;
  private canvas: CanvasRenderingContext2D;
  private game: AbstractGame;
  private levels: Level[];
  private levelIndex: number;
  private keyMapping: IKeyMapping[];

  constructor(container: HTMLElement, Game: AbstractGameConstructor) {
    const canvasStyle = `
      height: 100%;
      image-rendering: -moz-crisp-edges;
      image-rendering: -webkit-crisp-edges;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    `;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', canvasStyle);
    container.appendChild(canvas);

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

    this.game.defineLevels(level => {
      this.levels.push(level);
      return level;
    });

    this.game.defineKeyMapping((keyId, keyName, description, defaultKey) => {
      this.keyMapping.push({ keyId, keyName, description, defaultKey, key: defaultKey });
    });

    this.registerUserEvents();

    this.initializeLevel();
    this.redrawScene();
  }

  private initializeLevel() {
    this.game.board = this.currentLevel.createBoard();
  }

  private get currentLevel() {
    return this.levels[this.levelIndex];
  }

  private createRenderContext(): RenderContext {
    return new RenderContext(this.canvas, this.game.gameprops);
  }

  private registerUserEvents() {
    document.addEventListener('keydown', ev => {
      ev.preventDefault();
      ev.stopPropagation();

      const mapping = this.keyMapping.find(m => {
        return m.key.toLocaleLowerCase() === ev.key.toLocaleLowerCase()
      });

      if (mapping) {
        this.game.onInput({
          type: "keypressed",
          keyname: mapping.keyId
        });
      }

      this.checkNextTickFlag();
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

  redrawScene() {
    this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.game.board.render(this.createRenderContext());
  }
}