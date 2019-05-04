import {ColorPalette} from "./ColorPalette";

export const defaultColorPalettes: {[key: string]: ColorPalette<string>} = {
  pollen8: new ColorPalette(
    { color: '#73464c', alias: 'darkred' },
    { color: '#ab5675', alias: 'cherry' },
    { color: '#ee6a7c', alias: 'red' },
    { color: '#ffa7a5', alias: 'lightred' },
    { color: '#ffe07e', alias: 'yellow' },
    { color: '#ffe7d6', alias: 'beige', type: "background" },
    { color: '#72dcbb', alias: 'turquoise', type: "secondary" },
    { color: '#34acba', alias: 'blue', type: "primary" },
  ),
  granddad4: new ColorPalette(
    { color: '#4c1c2d', alias: 'darkred' },
    { color: '#d23c4e', alias: 'red', type: "primary" },
    { color: '#5fb1f5', alias: 'blue', type: "secondary" },
    { color: '#eaf5fa', alias: 'white', type: 'background' },
  )
};