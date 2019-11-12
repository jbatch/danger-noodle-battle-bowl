'use strict';

import 'phaser';
import { Snake } from './snake';
import KeyCodes from 'phaser/src/input/keyboard/keys/KeyCodes';
import EventManager from '../util/event-manager';

const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

const PLAYER_CONFIGS = {
  P1: { color: 0xff0000, keys: [KeyCodes.LEFT, KeyCodes.UP, KeyCodes.RIGHT] },
  P2: { color: 0x00ff00, keys: [KeyCodes.A, KeyCodes.S, KeyCodes.D] },
  P3: { color: 0x0000ff, keys: [KeyCodes.J, KeyCodes.K, KeyCodes.L] }
};

export default class Player {
  id: string;
  keys: Phaser.Input.Keyboard.Key[];
  snake: Snake;

  constructor(
    scene: Phaser.Scene,
    id: string
  ) {
    console.assert(PLAYER_CONFIGS[id] !== undefined, 'No config for player: ' + id);
    this.id = id;
    this.keys = PLAYER_CONFIGS[id].keys;
    this.snake = new Snake({ scene, player: this, color: PLAYER_CONFIGS[id].color });
  }

  destroy() {
    this.snake.destroy();
  }
}
