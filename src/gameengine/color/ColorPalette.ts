import {IColor} from "../types";

export class ColorPalette<ALIASES extends string> {
  private colors: IColor<ALIASES>[];

  constructor(...colors: IColor<ALIASES>[]) {
    this.colors = colors;
  }

  public withNewColor<NEWALIAS extends string>(color: IColor<NEWALIAS>): ColorPalette<ALIASES | NEWALIAS> {
    return new ColorPalette<ALIASES | NEWALIAS>(...this.colors, color);
  }

  public get(alias: ALIASES | number): string {
    if (typeof alias === "number") {
      return this.colors[alias].color;
    }

    const col = this.colors.find(c => c.alias === alias);

    if (!col) {
      throw Error(`Could not find color from alias.`);
    }

    return col.color;
  }

  public getColors(): string[] {
    return this.colors.map(c => c.color);
  }

  public getPrimaryColor() {
    return this.getColorByType('primary');
  }

  public getSecondaryColor() {
    return this.getColorByType('secondary');
  }

  public getBackgroundColor() {
    return this.getColorByType('background');
  }

  private getColorByType(type: string): IColor {
    return this.colors.find(c => c.type === type) || this.colors[0];
  }
}
