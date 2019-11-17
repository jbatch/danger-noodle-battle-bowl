'use strict';

import 'phaser';
import { StateManager } from '../util/state-manager';
import EventManager from '../util/event-manager';
import SceneManager from '../util/scene-manager';
import { SettingsManager } from '../util/settings-manager';

export default class ScoreScene extends Phaser.Scene {
  stateManager: StateManager;
  eventManager: EventManager;
  sceneManager: SceneManager;
  settingsManager: SettingsManager;
  scoreSceneItems: ScoreSceneItem[];

  pressAnyKeyText: Phaser.GameObjects.Text;
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
    this.events.on('wake', this.handleRoundWin, this);
    this.sceneManager = SceneManager.getInstance();
    this.settingsManager = SettingsManager.getInstance();
    this.cameras.main.setBackgroundColor(0x000000);
    this.playersThatNeedToReadyUp = this.stateManager.state.getPlayersList();
    this.scoreSceneItems = [];
    const title = this.add
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
    this.scene.sendToBack();
    this.scene.sleep();
  }

  handleRoundWin() {
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

    this.playersThatNeedToReadyUp = this.stateManager.state.getPlayersList();
    this.initKeyListeners();
  }

  initKeyListeners() {
    for (var player of this.playersThatNeedToReadyUp) {
      var readyUpButton = this.settingsManager.getSettingsForPlayer(player)
        .keys[1];
      this.input.keyboard.addKey(readyUpButton).once(
        'down',
        (function(index) {
          return function() {
            this.handleReadyUp(index);
          };
        })(player),
        this
      );
    }
  }

  handleReadyUp(id) {
    var item = this.scoreSceneItems.find(i => i.playerId === id);
    item.ready();
    this.playersThatNeedToReadyUp.splice(
      this.playersThatNeedToReadyUp.indexOf(id),
      1
    );
    if (this.playersThatNeedToReadyUp.length === 0) {
      this.time.delayedCall(
        2000,
        () => this.sceneManager.nextMap(this.scene),
        undefined,
        this
      );
    }
  }

  update() {}
}

export class ScoreSceneItem {
  x: number;
  y: number;
  playerId: string;
  label: Phaser.GameObjects.Text;
  crowns: Phaser.GameObjects.Image[];
  readyUpImage: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerId: string,
    crowns: number,
    ready: boolean
  ) {
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this.readyUpImage = scene.add
      .image(x, y, 'ready')
      .setVisible(ready)
      .setOrigin(0.5);
    this.label = scene.add
      .text(this.x + 30, this.y, playerId, { fontSize: '50px' })
      .setOrigin(0, 0.5);
    this.crowns = [];
    for (var i = 0; i < crowns; i++) {
      const crown = scene.add
        .image(this.x + 90 + i * 50, this.y - 5, 'crown')
        .setOrigin(0.0, 0.5);
      this.crowns.push(crown);
    }
  }

  ready() {
    this.readyUpImage.setVisible(true);
  }

  destroy() {
    this.label.destroy();
    for (var c of this.crowns) {
      c.destroy();
    }
    this.readyUpImage.destroy();
  }
}
