import {Renderable} from "../Renderable";
import {RenderContext} from "../RenderContext";
import {IPlayerKeyboardEvent, IPlayerMouseClickEvent} from "../types";
import {Box, Text} from "./UserInterface";

export class MenuButton implements Renderable {
  private text: string;
  private width: number;

  constructor(text: string, width: number) {
    this.text = text;
    this.width = width;
  }

  render(renderContext: RenderContext): void {
    const bg = new Box(this.width, 18, 'green');
    const text = new Text(this.text, 'black', this.width);

    bg.render(renderContext);
    text.render(renderContext);
  }

  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent): void {
  }

}