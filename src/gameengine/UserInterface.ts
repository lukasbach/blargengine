import {Renderable} from "./Renderable";
import {RenderContext} from "./RenderContext";
import {Position} from "./Position";

type SurfaceType = {
  lines: Array<{
    cells: Array<{
      render: Renderable,
      if?: () => boolean
    }>
  }>
};

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

export class UserInterface implements Renderable {
  private surface: SurfaceType;

  private constructor(surface: SurfaceType) {
    this.surface = surface;
  }

  public static fromMap(
    legend: Array<{
      id: string,
      render: Renderable,
      if?: () => boolean
    }>,
    map: string[]
  ): UserInterface {
    return new UserInterface({
      lines: map.map(l => ({
        cells: l
          .split('')
          .filter(c => c !== '.')
          .map(c => {
            const legendEntry = legend.find(l => l.id === c);

            if (!legendEntry) {
              throw Error('Could not resolve legend');
            }

            return {
              render: legendEntry.render,
              if: legendEntry.if
            };
          })
      }))
    });

  }

  public render(renderContext: RenderContext): void {
    let x = 0;
    let y = 0;

    console.log(this.surface);

    for (const l of this.surface.lines) {
      x = 0;

      for (const c of l.cells) {
        if (!c.if || c.if()) {
          c.render.render(renderContext.withOffset(new Position(x, y)));
        }

        x++;
      }

      y++;
    }
  }
}