'use strict';

import { Scene } from 'phaser';

import Egg from './egg';
import SettingsManager from '../util/settings-manager';

type ObjectData = { [key: string]: any };

export default class Map {
  settingsManager: SettingsManager;
  scene: Scene;
  dataKey: string;
  tileMapName: string;
  tileMapKey: string;
  collectables: Phaser.GameObjects.Group;
  staticLayer: Phaser.Tilemaps.StaticTilemapLayer;
  playerSpawns: { x: number; y: number; dir: string }[];
  collectableSpawns: { x: number; y: number }[];
  constructor(scene: Phaser.Scene, mapId: string) {
    this.scene = scene;
    this.settingsManager = SettingsManager.getInstance();
    this.dataKey = this.settingsManager.getMapConfig(mapId).mapDataKey;
    this.tileMapName = this.settingsManager.getMapConfig(mapId).tileMapName;
    this.tileMapKey = this.settingsManager.getMapConfig(mapId).tileMapKey;
    this.collectables = this.scene.add.group();
    this.playerSpawns = [];
    this.collectableSpawns = [];
    this.initMap();
  }

  initMap() {
    const tilemap = this.scene.make.tilemap({ key: this.dataKey });
    const tileset = tilemap.addTilesetImage(this.tileMapName, this.tileMapKey);

    // Create layers
    this.staticLayer = tilemap.createStaticLayer('static', tileset, 0, 0);
    this.staticLayer.setCollisionByProperty({ solid: true });

    // Get player object data
    const playerObjects = tilemap.createFromObjects(
      'object',
      'player',
      {},
      this.scene
    );

    for (var o of playerObjects) {
      this.playerSpawns.push({
        x: o.x,
        y: o.y,
        dir: this.getPropertyByName(o.data.getAll(), 'FACING').value
      });
      o.destroy();
    }

    // Get collectable object data
    const collectableObjects = tilemap.createFromObjects(
      'object',
      'collectable',
      {},
      this.scene
    );
    for (var o of collectableObjects) {
      this.collectableSpawns.push({ x: o.x, y: o.y });
      o.destroy();
    }
  }

  spawnCollectable() {
    const i = Phaser.Math.Between(0, this.collectableSpawns.length - 1);
    const cIndex = Phaser.Math.Between(
      0,
      this.settingsManager.getEnabledItems().length - 1
    );
    const collectTypeClass = this.settingsManager.getEnabledItems()[cIndex];
    
    console.log(this.settingsManager.getEnabledItems);
    // console.log(new collectTypeClass());
    this.collectables.add(
      new collectTypeClass({
        scene: this.scene,
        x: this.collectableSpawns[i].x,
        y: this.collectableSpawns[i].y
      })
    );
  }

  getPropertyByName(dataMap: ObjectData, name: string): any {
    var value = undefined;
    Object.keys(dataMap).forEach(key => {
      if (dataMap[key].name === name) {
        value = dataMap[key];
        return;
      }
    });
    return value;
  }
}
