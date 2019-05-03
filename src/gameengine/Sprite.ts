import {RenderContext} from "./RenderContext";
import {getColorCode} from "./utils";
import {Color, ISerializedPosition, ISpriteData} from "./types";
import {RenderableAt} from "./Renderable";

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
}
