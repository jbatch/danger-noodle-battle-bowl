'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';

export default class SettingsScene extends Phaser.Scene {
  sceneManager: SceneManager;
  constructor() {
    super({key: 'Settings', active: true});
    
  }

  init() {}

  preload() {}

  create() {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.cameras.main.setBackgroundColor({ r: 0, g: 0, b: 0, a: 150 });
    this.add.text(100, 100, 'SETTINGS');
    this.scene.sendToBack();
    this.scene.pause();
    this.scene.setVisible(false);
  }

  update() {
    if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
      this.sceneManager.closeSettings();
    }
  }
}
