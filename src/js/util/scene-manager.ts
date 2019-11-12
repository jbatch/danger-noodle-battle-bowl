'use strict';

import 'phaser';

var instance: SceneManager;

export default class SceneManager {
  // gameScene: Phaser.Scene;
  // settingsScene: Phaser.Scene;
  // scoreScene: Phaser.Scene;
  scenePlugin: Phaser.Scenes.ScenePlugin;

  constructor(scenePlugin: Phaser.Scenes.ScenePlugin) {
    console.assert(
      instance === undefined,
      'Trying to instantiate non-Singleton SceneManager'
    );
    this.scenePlugin = scenePlugin;
  }

  openSettings() {
    this.scenePlugin.pause('GameScene');
    this.scenePlugin.bringToTop('Settings');
    this.scenePlugin.resume('Settings');
    this.scenePlugin.setVisible(true, 'Settings');
  }

  closeSettings() {
    this.scenePlugin.sendToBack('Settings');
    this.scenePlugin.resume('GameScene');
    this.scenePlugin.pause('Settings');
  }

  showScore() {
    this.scenePlugin.bringToTop('Score');
    this.scenePlugin.pause('GameScene');
    this.scenePlugin.resume('Score');
    this.scenePlugin.setVisible(true, 'Score');
  }

  peekScore() {
    this.scenePlugin.bringToTop('Score');
    this.scenePlugin.pause('GameScene');
    this.scenePlugin.resume('Score');
    this.scenePlugin.setVisible(true, 'Score');
  }

  hideScore() {
    this.scenePlugin.pause('Score');
    this.scenePlugin.resume('GameScene');
    this.scenePlugin.bringToTop('GameScene');
  }

  nextMap() {
    this.scenePlugin.pause('Score');
    this.scenePlugin.get('GameScene').scene.restart();
    this.scenePlugin.bringToTop('GameScene');
  }

  static getInstance(scenePlugin: Phaser.Scenes.ScenePlugin) {
    if (instance === undefined) {
      instance = new SceneManager(scenePlugin);
    }
    return instance;
  }
}
