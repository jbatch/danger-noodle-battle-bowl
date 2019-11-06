'use strict';

import 'phaser';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super({key: 'Settings', active: true});
  }

  init() {}

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor({ r: 0, g: 0, b: 0, a: 150 });
    this.add.text(100, 100, 'SETTINGS');
    this.scene.sendToBack();
    this.scene.pause();
  }

  update() {
    if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
      console.log('Settings');
      this.scene.sendToBack();
      this.scene.resume('GameScene');
      this.scene.pause();
    }
  }
}
