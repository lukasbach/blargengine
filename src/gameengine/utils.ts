import {Color} from "./types";

export const getColorCode = (color: Color): string => {
  return typeof color === "string" ? color : '' + color; // TODO
};

export const flatObjectTransform = <T, U, K extends string>(obj: {[key in K]: T}, handler: (from: T, key: K) => U): {[key in K]: U} => {
  const newObj: any = {};

  for (let key of Object.keys(obj)) {
    newObj[key] = handler(obj[key as K], key as K);
  }

  return newObj;
};
