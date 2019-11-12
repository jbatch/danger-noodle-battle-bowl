'use strict';

import 'phaser';
import { Snake } from './snake';
import SettingsManager from '../util/settings-manager';



export default class Player {
  settingsManager: SettingsManager;
  id: string;
  keys: number[];
  snake: Snake;

  constructor(
    scene: Phaser.Scene,
    id: string
  ) {
    this.settingsManager = SettingsManager.getInstance();
    var config = this.settingsManager.getSettingsForPlayer(id);
    console.assert(config !== undefined, 'No config for player: ' + id);
    this.id = id;
    this.keys = config.keys;
    this.snake = new Snake({ scene, player: this, color: config.color });
  }

  destroy() {
    this.snake.destroy();
  }
}
