import {IPlayerKeyboardEvent, IPlayerMouseClickEvent, KeyDefine, LevelDefine} from "./types";
import {Sprite} from "./Sprite";
import {EntityTemplate} from "./entities/EntityTemplate";
import {AbstractGame} from "./AbstractGame";
import {Level} from "./Level";
import {Box, UserInterface, Text} from "./userinterface/UserInterface";

export class TestGame extends AbstractGame {

  backgroundColor = this.colorPalette.getBackgroundColor().color;

  spriteDefinitions = {
    player: [
      'ddddd',
      'd...d',
      'd...d',
      'd...d',
      'ddddd'
    ],
    floor: [
      'aaaaa',
      'aaaaa',
      'aaaaa',
      'aaaaa',
      'aaaaa'
    ],
    wall: [
      'bbbbb',
      'bbbbb',
      'bbbbb',
      'bbbbb',
      'bbbbb'
    ],
    key1: [
      '..b..',
      '.b.b.',
      '..b..',
      '..b..',
      '..bb.'
    ],
    key2: [
      '..c..',
      '.c.c.',
      '..c..',
      '..c..',
      '..cc.'
    ],
    key3: [
      '..d..',
      '.d.d.',
      '..d..',
      '..d..',
      '..dd.'
    ],
    large: [
      '..d.bbbbbb',
      '.d.d.....a',
      '..d......a',
      '..d.......',
      '..dd......',
      '..dd......',
      '..dd......',
      '..ddaaaa..',
      '..dd..aaa.',
      '..dd....aa',
    ],
    pushable: [
      'abbca',
      'bbbbb',
      'ccccc',
      'aaaaa',
      'abbca'
    ],
  }

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
        { id: 'X', render: new Box(20, 10, 'orange') },
        { id: 'T', render: new Text('welcome to my very stupid game', 'black', 50) },
      ], [
        '..X..',
        '....X',
        'X..T.'
      ]
    );
  }

  defineLevels(defineLevel: LevelDefine) {
    const player = new EntityTemplate(this.sprites.player, 'player');
    player.setPhysics({
      blocking: this.createEntityCollection('walls'),
      pushable: this.createEntityCollection('pushable'),
      destroying: this.createEntityCollection('collectible')
    });

    const block = new EntityTemplate(this.sprites.pushable);
    block.setPhysics({
      blocking: this.createEntityCollection('walls'),
      pushable: this.createEntityCollection('pushable')
    });
    block.setEventHandlers({
      onClick: () => {console.log('onClick'); return true},
      onDestroy: () => {console.log('onDestroy'); return true},
      onKey: () => {console.log('onKey'); return true},
      onMove: () => {console.log('onMove'); return true},
    });

    const large = new EntityTemplate(this.sprites.large, 'large', this.gameprops.tileSize);
    large.setPhysics({
      blocking: this.createEntityCollection('walls'),
      // pushable: this.createEntityCollection('pushable')
    });

    defineLevel(new Level([
      { id: 'B', layer: 'bg', entity: new EntityTemplate(this.sprites.floor), default: true },
      { id: 'A', layer: 'walls', entity: new EntityTemplate(this.sprites.wall) },
      { id: 'K', layer: 'collectible', entity: new EntityTemplate(this.sprites.key1) },
      { id: 'C', layer: 'fg', entity: player },
      { id: 'P', layer: 'pushable', entity: large },
    ], [
      'AAAAAAAA',
      'A...P...',
      'A.......',
      'A.......',
      'A.....AA',
      'A...C.AA',
      'AAAAAAAA',
    ]))
  }
}