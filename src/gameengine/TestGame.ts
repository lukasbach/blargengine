import {
  AbstractGame,
  Entity,
  EntityTemplate,
  IPlayerKeyboardEvent, IPlayerMouseClickEvent,
  KeyDefine,
  Level,
  LevelDefine,
  Sprite
} from "./AbstractGame";

export class TestGame extends AbstractGame {

  defineKeyMapping(defineKey: KeyDefine) {
    defineKey('action', 'Action key', '', 'enter');
    defineKey('up', '', '', 'arrowup');
    defineKey('down', '', '', 'arrowdown');
    defineKey('right', '', '', 'arrowright');
    defineKey('left', '', '', 'arrowleft');
  }


  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent) {
    this.getEntity('player')!.hookToMovement(event, this.nextTick.bind(this));
  }

  defineLevels(defineLevel: LevelDefine) {
    const spr1 = new Sprite(['red', 'blue', 'green', 'yellow'], [
      'abbca',
      'bbbbb',
      'ccccc',
      'aaaaa',
      'abbca'
    ]);
    const spr2 = new Sprite(['red', 'blue', 'green', 'yellow'], [
      'ddddd',
      'daaad',
      'dcccd',
      'dbbcd',
      'ddddd'
    ]);
    const floor = new Sprite(['green'], [
      'aaaaa',
      'aaaaa',
      'aaaaa',
      'aaaaa',
      'aaaaa'
    ]);

    defineLevel(new Level([
      { id: 'A', layer: 'bg', entity: new EntityTemplate(spr1) },
      { id: 'B', layer: 'bg', entity: new EntityTemplate(floor) },
      { id: 'C', layer: 'fg', entity: new EntityTemplate(spr2, 'player') },
    ], [
      'AAAAAAA',
      'AABBBAA',
      'AABCBAA',
      'AAAAAAA',
    ]))
  }
}