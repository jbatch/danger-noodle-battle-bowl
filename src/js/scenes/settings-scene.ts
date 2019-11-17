'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';
import {
  SettingsManager,
  MapConfig,
  ItemConfig
} from '../util/settings-manager';

export default class SettingsScene extends Phaser.Scene {
  sceneManager: SceneManager;
  settingsManager: SettingsManager;
  constructor() {
    super({ key: 'Settings', active: true, visible: true });
  }

  init() {}

  preload() {
    this.load.image('map1', './media/map1.png');
    this.load.image('map2', './media/map2.png');
  }

  create() {
    this.sceneManager = SceneManager.getInstance();
    this.settingsManager = SettingsManager.getInstance();
    this.cameras.main.setBackgroundColor({ r: 0, g: 0, b: 0, a: 150 });
    this.add.text(100, 100, 'SETTINGS');
    this.loadMaps();
    this.loadItems();
    this.scene.sleep();
  }

  loadMaps() {
    const allMaps = this.settingsManager.maps;
    for (var i = 0; i < allMaps.length; i++) {
      new MapItem({
        scene: this,
        x: 200 + 150 * i,
        y: 200,
        mapConfig: allMaps[i]
      });
    }
  }

  loadItems() {
    const allItems = this.settingsManager.items;
    for (var i = 0; i < allItems.length; i++) {
      new ItemItem({
        scene: this,
        x: 200 + 100 * i,
        y: 300,
        itemConfig: allItems[i]
      });
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
      this.sceneManager.closeSettings(this.scene);
    }
  }
}

type MapItemProps = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  mapConfig: MapConfig;
};

class MapItem extends Phaser.GameObjects.Image {
  background: Phaser.GameObjects.Rectangle;
  constructor({ scene, x, y, mapConfig }: MapItemProps) {
    super(scene, x, y, mapConfig.id);
    this.setOrigin(0.5, 0.5);
    this.setScale(0.1);
    this.background = this.scene.add
      .rectangle(
        x,
        y,
        this.displayWidth + 20,
        this.displayHeight + 20,
        0xffffff,
        0.7
      )
      .setOrigin(0.5, 0.5);
    this.scene.add.existing(this);
  }
}

type ItemItemProps = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  itemConfig: ItemConfig;
};

class ItemItem extends Phaser.GameObjects.Image {
  background: Phaser.GameObjects.Rectangle;
  constructor({ scene, x, y, itemConfig }: ItemItemProps) {
    super(scene, x, y, itemConfig.id);
    this.setOrigin(0.5, 0.5);
    this.setInteractive();
    // this.setScale(0.1);
    this.background = this.scene.add
      .rectangle(
        x,
        y,
        this.displayWidth + 0,
        this.displayHeight + 0,
        0xffffff,
        0.7
      )
      .setOrigin(0.5, 0.5);
    this.scene.add.existing(this);
  }
}
