import {Board} from "./Board";
import {EntityTemplate} from "./entities/EntityTemplate";
import {IAlias, ITimeTravelable} from "./types";
import {Position} from "./Position";

export class Level {
  private readonly legend: Array<{ id: string, entity: EntityTemplate, layer: string, default?: boolean }>;
  private readonly map: string[];

  constructor(
    legend: Array<{ id: string, entity: EntityTemplate, layer: string, default?: boolean }>,
    map: string[]
  ) {
    this.legend = legend;
    this.map = map;
  }

  public createBoard(createAlias: (alias: IAlias) => void): Board {
    const board = new Board();

    // Create layers
    const layerNames: string[] = [];
    for (const item of this.legend) {
      if (!layerNames.includes(item.layer)) {
        layerNames.push(item.layer);
        const layer = board.newLayer(item.layer);
        createAlias({ name: item.layer, refersTo: layer });
      }
    }

    let x = 0;
    let y = 0;

    for (const line of this.map) {
      x = 0;

      for (const cell of line.split('')) {
        if (cell !== '.') {
          const legendEntry = this.legend.find(e => e.id === cell);

          if (!legendEntry) {
            throw Error('Could not find legend entry.');
          }

          const layer = board.getLayer(legendEntry.layer);
          legendEntry.entity.createEntity(new Position(x, y), layer);
        }

        x++;
      }

      y++;
    }

    // Create default layer
    const defaultItem = this.legend.find(l => !!l.default);

    if (defaultItem) {
      const defaultLayer = board.getLayer(defaultItem.layer);
      for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
          defaultItem.entity.createEntity(new Position(i, j), defaultLayer);
        }
      }
    }

    return board;
  }
}
