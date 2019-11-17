'use strict';

import { Scene } from 'phaser';

import { SettingsManager } from '../util/settings-manager';
import EventManager from '../util/event-manager';

type ObjectData = { [key: string]: any };

export default class Map {
  settingsManager: SettingsManager;
  eventManager: EventManager;
  scene: Scene;
  dataKey: string;
  tileMapName: string;
  tileMapKey: string;
  collectables: Phaser.GameObjects.Group;
  staticLayer: Phaser.Tilemaps.StaticTilemapLayer;
  playerSpawns: { x: number; y: number; dir: string }[];
  collectableSpawns: { x: number; y: number; full: boolean; id: number }[];
  constructor(scene: Phaser.Scene, mapId: string) {
    this.scene = scene;
    this.settingsManager = SettingsManager.getInstance();
    this.eventManager = EventManager.getInstance();
    this.dataKey = this.settingsManager.getMapConfig(mapId).mapDataKey;
    this.tileMapName = this.settingsManager.getMapConfig(mapId).tileMapName;
    this.tileMapKey = this.settingsManager.getMapConfig(mapId).tileMapKey;
    this.collectables = this.scene.add.group();
    this.playerSpawns = [];
    this.collectableSpawns = [];
    this.initMap();
    this.eventManager.on('EGG_COLLECTED', this.resetSpawn, this);
    this.eventManager.on('ITEM_COLLECTED', this.resetSpawn, this);
  }

  resetSpawn({ spawnId }) {
    console.log('reset Spwan', { spawnId, spawns: this.collectableSpawns });
    const spawn = this.collectableSpawns.find(s => s.id === spawnId);
    if (!spawn) {
      return;
    }
    spawn.full = false;
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
    var i = 0;
    for (var o of collectableObjects) {
      this.collectableSpawns.push({ x: o.x, y: o.y, full: false, id: i });
      i++;
      o.destroy();
    }
  }

  spawnCollectable() {
    const enabledItems = this.settingsManager.getEnabledItems();
    if (enabledItems.length === 0) {
      return;
    }
    const emptySpawns = this.collectableSpawns.filter(s => !s.full);
    if (emptySpawns.length === 0) {
      return;
    }
    const i = Phaser.Math.Between(0, emptySpawns.length - 1);
    const cIndex = Phaser.Math.Between(0, enabledItems.length - 1);
    const collectTypeClass = enabledItems[cIndex];
    emptySpawns[i].full = true;

    this.collectables.add(
      new collectTypeClass({
        scene: this.scene,
        x: emptySpawns[i].x,
        y: emptySpawns[i].y,
        spawnId: emptySpawns[i].id
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
