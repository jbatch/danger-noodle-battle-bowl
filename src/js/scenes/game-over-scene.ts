'use strict';

import 'phaser';
import { StateManager } from '../util/state-manager';
import EventManager from '../util/event-manager';
import SceneManager from '../util/scene-manager';
import { SettingsManager } from '../util/settings-manager';
import { ScoreSceneItem } from './score-scene';

export default class GameOverScene extends Phaser.Scene {
  stateManager: StateManager;
  eventManager: EventManager;
  sceneManager: SceneManager;
  settingsManager: SettingsManager;
  scoreSceneItems: ScoreSceneItem[];

  constructor() {
    super({ key: 'GameOver', active: true });
  }

  init() {}

  preload() {}

  create() {
    this.stateManager = StateManager.getInstance();
    this.eventManager = EventManager.getInstance();
    this.sceneManager = SceneManager.getInstance();
    this.settingsManager = SettingsManager.getInstance();
    const title = this.add
      .text((this.game.config.width as number) / 2, 50, 'Game Over', {
        fontSize: '50px'
      })
      .setOrigin(0.5);
    this.scoreSceneItems = [];

    this.add
      .text(
        (this.game.config.width as number) / 2,
        (this.game.config.height as number) * 0.8,
        'Press SPACE to start again',
        {
          fontSize: '30px'
        }
      )
      .setAlign('center')
      .setOrigin(0.5);

    this.events.on('wake', this.showScores, this);
    this.scene.sleep();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE'))) {
      this.stateManager.state.resetScores();
      this.sceneManager.reset(this.scene);
    }
  }

  showScores() {
    for (var item of this.scoreSceneItems) {
      item.destroy();
    }
    this.scoreSceneItems = [];
    const scores = this.stateManager.state.getScores();
    scores.sort((a, b) => b.score - a.score);

    for (var i = 0; i < scores.length; i++) {
      const { id, score } = scores[i];
      const item = new ScoreSceneItem(this, 70, 100 + i * 60, id, score, false);
      this.scoreSceneItems.push(item);
    }

    // this.playersThatNeedToReadyUp = this.stateManager.state.getPlayersList();
    // this.initKeyListeners();
  }
}
