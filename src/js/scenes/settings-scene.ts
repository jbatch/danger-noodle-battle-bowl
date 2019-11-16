'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';

export default class SettingsScene extends Phaser.Scene {
  sceneManager: SceneManager;
  constructor() {
    super({key: 'Settings', active: true, visible: true});
    
  }

  init() {}

  preload() {}

  create() {
    this.sceneManager = SceneManager.getInstance();
    this.cameras.main.setBackgroundColor({ r: 0, g: 0, b: 0, a: 150 });
    this.add.text(100, 100, 'SETTINGS');
    this.scene.sleep();
  }

  update() {
    if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
      this.sceneManager.closeSettings(this.scene);
    }
  }
}
