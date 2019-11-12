'use strict';

import 'phaser';
import GameScene from './js/scenes/game-scene';
import SettingsScene from './js/scenes/settings-scene';
import ScoreScene from './js/scenes/score-scene';
import './assets/css/app.css';

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: 'main',
  scene: [GameScene, SettingsScene, ScoreScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(config);
});
