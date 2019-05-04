import {Renderable} from "./Renderable";
import {IMeasurements, MeasureRenderContext, RenderContext} from "./RenderContext";
import {Position} from "./Position";
import {textFont} from "./Font";
import {ICanReceiveInput, IPlayerKeyboardEvent, IPlayerMouseClickEvent} from "./types";
import {isTemplateElement} from "@babel/types";
import {render} from "react-dom";

type SurfaceType = Array<{
  render: Renderable,
  if?: () => boolean,
  x: number,
  y: number,
  measurements: IMeasurements
}>;

export class Box implements Renderable {
  private readonly w: number;
  private readonly h: number;
  private readonly c: string;

  constructor(w: number, h: number, color: string) {
    this.w = w;
    this.h = h;
    this.c = color;
  }

  render(renderContext: RenderContext): void {
    renderContext.drawBox(new Position(0, 0), this.c, this.w, this.h);
  }
}

export class Text implements Renderable {
  private font = textFont;
  private text: string;
  private charWidths?: number[];
  private charHeight: number;
  private width?: number;
  private color: string;

  constructor(text: string, color: string, width?: number) {
    this.text = text;
    this.width = width;
    this.color = color;

    const measure = new MeasureRenderContext();
    this.renderCharacter(text.charAt(0), measure);
    this.charHeight = measure.getMeasurements().bottom + 4;
    console.log(text.charAt(0), measure.getMeasurements());

    if (width) {
      this.charWidths = [];

      for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) === '\n' || text.charAt(i) === ' ') {
          this.charWidths.push(0);
        } else {
          measure.resetMeasurements();
          this.renderCharacter(text.charAt(i), measure);
          this.charWidths.push(measure.getMeasurements().right);
        }
      }
    }
  }

  render(renderContext: RenderContext): void {
    let line = 0;
    let leftOffset = 0;

    for (let i = 0; i < this.text.length; i++) {
      if (this.charWidths && this.width && leftOffset + this.charWidths[i] >= this.width) {
        line++;
        leftOffset = 0;
      }

      if (this.text.charAt(i) === '\n') {
        line++;
        leftOffset = 0;
        continue;
      }

      if (this.text.charAt(i) === ' ') {
        leftOffset += 5;
        continue;
      }

      this.renderCharacter(
        this.text.charAt(i),
        renderContext.withOffset(new Position(0, 0, leftOffset, line * this.charHeight))
      );
      leftOffset += 2;

      if (this.charWidths) {
        leftOffset += this.charWidths[i];
      }
    }
  }

  private renderCharacter(char: string, renderContext: RenderContext) {
    this.font[char.toLocaleLowerCase()].forEach((line, y) => {
      line.split('').forEach((pixel, x) => {
        if (pixel !== '.') {
          renderContext.drawPixel(new Position(0, 0, x, y), this.color);
        }
      })
    })
  }
}

export class UserInterface implements Renderable, ICanReceiveInput {
  private surface: SurfaceType;

  private constructor(surface: SurfaceType) {
    this.surface = surface;
  }

  public static fromComponents(components: Array<{
    render: Renderable,
    if?: () => boolean
  }>): UserInterface {
    const measure = new MeasureRenderContext();

    const surface: SurfaceType = components.map(c => {
      measure.resetMeasurements();
      c.render.render(measure);
      return {
        render: c.render,
        if: c.if,
        measurements: measure.getMeasurements(),
        x: 0,
        y: 0
      };
    });

    return new UserInterface(surface);
  }

  public static fromMap(
    legend: Array<{
      id: string,
      render: Renderable,
      if?: () => boolean
    }>,
    map: string[]
  ): UserInterface {
    const surface: SurfaceType = [];
    const measure = new MeasureRenderContext();

    legend.forEach((legendEntry) => {
      map.forEach((l, y) => {
        l.split('').forEach((c, x) => {
          if (c !== legendEntry.id) return;

          /*if (c === '.') return;

          const legendEntry = legend.find(l => l.id === c);

          if (!legendEntry) {
            throw Error('Could not resolve legend');
          }*/

          measure.resetMeasurements();
          legendEntry.render.render(measure.withOffset(new Position(x, y)));
          const renderPosition = new Position(0, 0, measure.getMeasurements().right, measure.getMeasurements().bottom);

          surface.push({
            render: legendEntry.render,
            if: legendEntry.if,
            measurements: measure.getMeasurements(),
            x, y
          });
        })
      });
    });

    return new UserInterface(surface);
  }

  public render(renderContext: RenderContext): void {
    for (const el of this.surface) {
      if (!el.if || el.if()) {
        el.render.render(renderContext.withOffset(new Position(el.x, el.y)));
      }
    }
  }

  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent): void {
    if (event.type === "mouseclick") {
      for (const item of this.surface) {
        const hit =
          event.x < item.measurements.right &&
          event.x > item.measurements.left &&
          event.y > item.measurements.top &&
          event.y < item.measurements.bottom;

        if (item.render.onInput && hit) {
          item.render.onInput({
            type: "mouseclick",
            tile: event.tile,
            x: event.x - item.measurements.left,
            y: event.y - item.measurements.top
          })
        }
      }
    }
  }
}