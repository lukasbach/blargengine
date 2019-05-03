import {IPlayerKeyboardEvent, IPlayerMouseClickEvent, KeyDefine, LevelDefine} from "./types";
import {Sprite} from "./Sprite";
import {EntityTemplate} from "./EntityTemplate";
import {AbstractGame} from "./AbstractGame";
import {Level} from "./Level";
import {Box, UserInterface} from "./UserInterface";

export class TestGame extends AbstractGame {

  defineKeyMapping(defineKey: KeyDefine) {
    defineKey('action', 'Action key', '', 'enter');
    defineKey('up', '', '', 'arrowup');
    defineKey('down', '', '', 'arrowdown');
    defineKey('right', '', '', 'arrowright');
    defineKey('left', '', '', 'arrowleft');
  }

  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent) {
    this.getEntity('player').hookToMovement(event, () => {
      this.board.storeStep();
      this.nextTick();
    });

    if (event.type === "keypressed" && event.keyname === "action") {
      this.board.goBack();
      this.nextTick();
    }
  }

  onInitLevel() {
    this.board.storeStep();
  }

  renderBottomLegend() {
    return UserInterface.fromMap(
      [
        { id: 'X', render: new Box(20, 10, 'orange') }
      ], [
        '..X..',
        '.....',
        '....X'
      ]
    );
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
      'd...d',
      'd...d',
      'd...d',
      'ddddd'
    ]);
    const spr3 = new Sprite(['red', 'blue', 'green', 'yellow'], [
      'aaaaa',
      'abbba',
      'abcba',
      'abbba',
      'aaaaa'
    ]);
    const floor = new Sprite(['chocolate'], [
      'aaaaa',
      'aaaaa',
      'aaaaa',
      'aaaaa',
      'aaaaa'
    ]);

    const player = new EntityTemplate(spr2, 'player');
    player.setPhysics({
      blocking: this.createEntityCollection('walls'),
      pushable: this.createEntityCollection('pushable')
    });

    const block = new EntityTemplate(spr3);
    block.setPhysics({
      blocking: this.createEntityCollection('walls'),
      pushable: this.createEntityCollection('pushable')
    });

    defineLevel(new Level([
      { id: 'B', layer: 'bg', entity: new EntityTemplate(floor), default: true },
      { id: 'A', layer: 'walls', entity: new EntityTemplate(spr1) },
      { id: 'C', layer: 'fg', entity: player },
      { id: 'P', layer: 'pushable', entity: block },
    ], [
      'AAAAAAAA',
      'A.......',
      'A.......',
      'A..P....',
      'A.P...AA',
      'A...C.AA',
      'AAAAAAAA',
    ]))
  }
}