import {RenderContext} from "./RenderContext";
import {getColorCode} from "./utils";
import {Color, ISerializedPosition, ISpriteData} from "./types";
import {RenderableAt} from "./Renderable";

export class Sprite implements RenderableAt {
  private readonly data: ISpriteData;
  private readonly colors: Color[];
  private readonly lines: string[];

  constructor(colors: Color[], lines: string[]) {
    console.log(lines)
    this.data = {
      lines: lines.map(l => ({
        cells: l.split('').map(c => ({
          color: this.getColorFromChar(colors, c)
        }))
      }))
    };
    this.lines = lines;
    this.colors = colors;
  }

  public getData(): ISpriteData {
    return this.data;
  }

  private getColorFromChar(colors: Color[], char: string) {
    if (char === '.') {
      return 'transparent';
    }

    return getColorCode(colors[char.charCodeAt(0) - 97] || colors[parseInt(char)]);
  }

  public renderAt(renderContext: RenderContext, position: ISerializedPosition): void {
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

  public getSubSprites(tileSize: number) {
    const output: Array<{ x: number, y: number, sprite: Sprite }> = [];

    for (let y = 0; y < this.data.lines.length / tileSize; y++) {
      for (let x = 0; x < this.data.lines[x].cells.length / tileSize; x++) {
        output.push({
          x, y,
          sprite: new Sprite(
            this.colors,
            this.lines
              .slice(y * tileSize, (y + 1) * tileSize)
              .map(line => line.slice(x * tileSize, (x + 1) * tileSize))
          )
        });
      }
    }

    return output;
  }
}
