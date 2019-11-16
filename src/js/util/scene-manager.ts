'use strict';

import 'phaser';
import { StateManager } from './state-manager';
import SettingsManager from './settings-manager';

var instance: SceneManager;

export default class SceneManager {
  stateManager: StateManager;
  settingsManager: SettingsManager;

  constructor() {
    console.assert(
      instance === undefined,
      'Trying to instantiate non-Singleton SceneManager'
    );
    this.stateManager = StateManager.getInstance();
    this.settingsManager = SettingsManager.getInstance();
  }

  openSettings(scenePlugin: Phaser.Scenes.ScenePlugin) {
    scenePlugin.pause('GameScene');
    scenePlugin.bringToTop('Settings');
    scenePlugin.resume('Settings');
    scenePlugin.setVisible(true, 'Settings');
  }

  closeSettings(scenePlugin: Phaser.Scenes.ScenePlugin) {
    scenePlugin.resume('GameScene');
    scenePlugin.pause('Settings');
    scenePlugin.setVisible(false, 'Settings');
  }

  showScore(scenePlugin: Phaser.Scenes.ScenePlugin) {
    console.log('Show Score')
    scenePlugin.switch('Score');
  }

  showGameOver(scenePlugin: Phaser.Scenes.ScenePlugin) {
    scenePlugin.switch('GameOver');
  }

  nextMap(scenePlugin: Phaser.Scenes.ScenePlugin) {
    
    const currentMap = this.stateManager.state.getCurrentMap();
    const allMaps = this.settingsManager.getEnabledMaps();
  
    const nextMap = allMaps[(allMaps.indexOf(currentMap) + 1) % allMaps.length];
    this.stateManager.state.setCurrentMap(nextMap);
    scenePlugin.get('GameScene').scene.restart({ map: nextMap });
    scenePlugin.switch('GameScene');
  }

  reset(scenePlugin: Phaser.Scenes.ScenePlugin) {
    const allMaps = this.settingsManager.getEnabledMaps();
    const nextMap = allMaps[0];
    this.stateManager.state.setCurrentMap(nextMap);
    scenePlugin.get('GameScene').scene.restart({ map: nextMap });
    scenePlugin.switch('GameScene');
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new SceneManager();
    }
    return instance;
  }
}
