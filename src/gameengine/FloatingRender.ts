import {Renderable} from "./Renderable";
import {Position} from "./Position";
import {MeasureRenderContext, RenderContext} from "./RenderContext";

export class FloatingRender {
  public static floatRender(
    renderable: Renderable,
    renderContext: RenderContext,
    verticalFloat: 'top' | 'bottom' | 'center',
    horizontalFloat: 'left' | 'right' | 'center',
  ): {
    x: number,
    y: number,
    width: number,
    height: number
  } {
    const measure = new MeasureRenderContext();

    renderable.render(measure);

    const {left, right, bottom, top} = measure.getMeasurements();
    let x = 0;
    let y = 0;


    switch (horizontalFloat) {
      case "left":
        x = 0;
        break;

      case "center":
        x = renderContext.width / 2 - right / 2;
        break;

      case "right":
        x = renderContext.width - right;
        break;
    }

    switch (verticalFloat) {
      case "top":
        y = 0;
        break;

      case "center":
        y = renderContext.height / 2 - bottom / 2;
        break;

      case "bottom":
        y = renderContext.height - bottom;
        break;
    }

    renderable.render(renderContext.withOffset(new Position(0, 0, x, y)));

    return { x, y, width: right, height: bottom };
  }
}