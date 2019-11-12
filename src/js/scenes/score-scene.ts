'use strict';

import 'phaser';
import { StateManager } from '../util/state-manager';
import EventManager from '../util/event-manager';
import SceneManager from '../util/scene-manager';
import SettingsManager from '../util/settings-manager';

export default class ScoreScene extends Phaser.Scene {
  stateManager: StateManager;
  eventManager: EventManager;
  sceneManager: SceneManager;
  settingsManager: SettingsManager;
  playerLabels: Phaser.GameObjects.Text[];
  pressAnyKeyText: Phaser.GameObjects.Text;
  crowns: Phaser.GameObjects.Image[];
  playersThatNeedToReadyUp: string[];
  constructor() {
    super({ key: 'Score', active: true });
  }

  init() {}

  preload() {
    this.load.image('crown', './media/crown.png');
    this.load.image('ready', './media/ready.png');
  }

  create() {
    this.stateManager = StateManager.getInstance();
    this.eventManager = EventManager.getInstance();
    this.eventManager.on('ROUND_WIN', this.handleRoundWin, this);
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.settingsManager = SettingsManager.getInstance();
    this.cameras.main.setBackgroundColor(0x000000);
    this.crowns = [];
    this.playerLabels = [];
    this.playersThatNeedToReadyUp = this.stateManager.state.getPlayersList();
    const text = this.add
      .text((this.game.config.width as number) / 2, 50, 'Score', {
        fontSize: '50px'
      })
      .setOrigin(0.5);

    this.pressAnyKeyText = this.add
      .text(
        (this.game.config.width as number) / 2,
        (this.game.config.height as number) * 0.8,
        'Press jump to ready up\nfor the next round',
        {
          fontSize: '30px'
        }
      )
      .setAlign('center')
      .setOrigin(0.5);

    this.add.image(250, 250, 'ready');
    this.scene.sendToBack();
    this.scene.pause();
    this.scene.setVisible(false);
  }

  handleRoundWin() {
    // Refresh all crowns
    for (var c of this.crowns) {
      c.destroy();
    }
    for (var l of this.playerLabels) {
      l.destroy();
    }
    const scores = this.stateManager.state.getScores();
    scores.sort((a, b) => b.score - a.score);
    var yOffset = 0;
    for (var playerScore of scores) {
      var xOffset = 0;
      const label = this.add.text(100, 100 + yOffset, playerScore.id, {
        fontSize: '50px'
      });
      this.playerLabels.push(label);
      for (var i = 0; i < playerScore.score; i++) {
        const crown = this.add.image(190 + xOffset, 120 + yOffset, 'crown');
        this.crowns.push(crown);
        xOffset += 60;
      }
      yOffset += 60;
    }

    this.playersThatNeedToReadyUp = this.stateManager.state.getPlayersList();
    this.initKeyListeners();
  }

  initKeyListeners() {
    for(var player of this.playersThatNeedToReadyUp) {
      var readyUpButton = this.settingsManager.getSettingsForPlayer(player).keys[1];
      this.input.keyboard.addKey(readyUpButton).once('down', () => this.handleReadyUp(player), this);
    }
  }

  handleReadyUp(id) {
    this.playersThatNeedToReadyUp.splice(this.playersThatNeedToReadyUp.indexOf(id), 1);
    if(this.playersThatNeedToReadyUp.length === 0) {
      this.sceneManager.nextMap();
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('C'))) {
      this.sceneManager.nextMap();
    }
  }
}
