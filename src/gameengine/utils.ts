import {Color} from "./types";

export const getColorCode = (color: Color): string => {
  return typeof color === "string" ? color : '' + color; // TODO
};
