import {IPlayerKeyboardEvent, IPlayerMouseClickEvent, KeyDefine, LevelDefine} from "./types";
import {Sprite} from "./Sprite";
import {EntityTemplate} from "./entities/EntityTemplate";
import {AbstractGame} from "./AbstractGame";
import {Level} from "./Level";
import {Box, UserInterface, Text} from "./userinterface/UserInterface";
import {flatObjectTransform} from "./utils";
import {Position} from "./Position";
import {Entity} from "./entities/Entity";

export class KeyGame extends AbstractGame {

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
    key: [
      '..a..',
      '.a.a.',
      '..a..',
      '..a..',
      '..aa.'
    ],
    doorVerticalLocked: [
      '.aaa.',
      '.aaa..',
      '.aaa.',
      '.aaa.',
      '.aaa.',
      '.aaa.',
      '.aaa.',
      '.aaa',
      '.aaa.',
      '.aaa.',
      '.aaa.',
      '.aaa.',
      '.aaa.',
      '.aaa.',
      '.aaa.',
    ],
    doorVerticalUnlocked: [
      '.aaa.',
      '..a...',
      '.....',
      '.....',
      '.....',
      '.....',
      '.....',
      '....',
      '.....',
      '.....',
      '.....',
      '.....',
      '.....',
      '..a..',
      '.aaa.',
    ],
  };

  animationDefinitions = {};

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
    this.state = {
      keys: {
        red: false,
        green: false,
        blue: false
      }
    }
  }

  defineLevels(defineLevel: LevelDefine) {
    let keys = flatObjectTransform({
      red: new Sprite(['#ff0000'], this.spriteDefinitions.key),
      green: new Sprite(['#00ff00'], this.spriteDefinitions.key),
      blue: new Sprite(['#0000ff'], this.spriteDefinitions.key)
    }, (from, k) => new EntityTemplate(from, k)
        .setPhysics({})
    );

    let doors = flatObjectTransform({
      verticalLockedRed: new Sprite(['#ff0000'], this.spriteDefinitions.doorVerticalLocked),
      verticalUnlockedRed: new Sprite(['#ff0000'], this.spriteDefinitions.doorVerticalUnlocked),
      verticalLockedGreen: new Sprite(['#00ff00'], this.spriteDefinitions.doorVerticalLocked),
      verticalUnlockedGreen: new Sprite(['#00ff00'], this.spriteDefinitions.doorVerticalUnlocked),
      verticalLockedBlue: new Sprite(['#0000ff'], this.spriteDefinitions.doorVerticalLocked),
      verticalUnlockedBlue: new Sprite(['#0000ff'], this.spriteDefinitions.doorVerticalUnlocked),
    }, (from, k) => new EntityTemplate(from, k));


    const player = new EntityTemplate(this.sprites.player, 'player')
      .setPhysics({
        blocking: this.createEntityCollection('walls', 'door'),
        pushable: this.createEntityCollection('pushable', 'large'),
        destroying: this.createEntityCollection('collectible'),
        handlesEntering: this.createEntityCollection('collectible')
      })
      .setEventHandlers({
        onEnter: entity => {
          if (entity && entity.alias && entity.alias === 'red') {
            this.state.keys[entity.alias] = true;
            entity.destroy();

            if (doors.verticalLockedRed.hasInstances()) {
              const pos = (doors.verticalLockedRed.getInstance() as Entity).getPosition();
              doors.verticalLockedRed.doOnEntity(e => (e as Entity).destroy());
              this.spawnEntity(doors.verticalUnlockedRed, pos, 'doorUnlocked');
            }
          }

          if (entity && entity.alias && entity.alias === 'green') {
            this.state.keys[entity.alias] = true;
            entity.destroy();

            if (doors.verticalLockedGreen.hasInstances()) {
              const pos = (doors.verticalLockedGreen.getInstance() as Entity).getPosition();
              doors.verticalLockedGreen.doOnEntity(e => (e as Entity).destroy());
              this.spawnEntity(doors.verticalUnlockedGreen, pos, 'doorUnlocked');
            }
          }

          if (entity && entity.alias && entity.alias === 'blue') {
            this.state.keys[entity.alias] = true;
            entity.destroy();

            if (doors.verticalLockedBlue.hasInstances()) {
              const pos = (doors.verticalLockedBlue.getInstance() as Entity).getPosition();
              doors.verticalLockedBlue.doOnEntity(e => (e as Entity).destroy());
              this.spawnEntity(doors.verticalUnlockedBlue, pos, 'doorUnlocked');
            }
          }
        }
      });


    defineLevel(new Level([
      { id: '_', layer: 'bg', entity: new EntityTemplate(this.sprites.floor), default: true },
      { id: 'A', layer: 'walls', entity: new EntityTemplate(this.sprites.wall) },
      { id: 'R', layer: 'collectible', entity: keys.red },
      { id: 'G', layer: 'collectible', entity: keys.green },
      { id: 'B', layer: 'collectible', entity: keys.blue },
      { id: 'D', layer: 'door', entity: doors.verticalLockedRed },
      { id: 'E', layer: 'door', entity: doors.verticalLockedGreen },
      { id: 'F', layer: 'door', entity: doors.verticalLockedBlue },
      { id: 'C', layer: 'fg', entity: player },
      { id: '_', layer: 'doorUnlocked', entity: doors.verticalLockedBlue },
    ], [
      'AAAAAAAAAAAAAAA',
      'A....R.D.F..E.A',
      'A....G........A',
      'A....B........A',
      'A.....AAAAAAA.A',
      'A...C.AA......A',
      'AAAAAAAAAAAAAAA',
    ]))
  }
}