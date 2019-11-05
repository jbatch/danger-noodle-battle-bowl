'use strict';

import { Scene } from "phaser";

import Egg from './egg';

export default class Map {
  scene: Scene;
  collectables: Phaser.GameObjects.Group;
  staticLayer: Phaser.Tilemaps.StaticTilemapLayer;
  playerSpawns: { x: number; y: number }[];
  collectableSpawns: { x: number; y: number }[];
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.collectables = this.scene.add.group();
    this.playerSpawns = [];
    this.collectableSpawns = [];
    this.initMap();
  }

  initMap() {
    const tilemap = this.scene.make.tilemap({ key: 'mapdata' });
    const tileset = tilemap.addTilesetImage('map-tilesheet', 'tilemap');

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
      this.playerSpawns.push({ x: o.x, y: o.y });
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
    console.log(i);
    var spawn = this.collectableSpawns[i];
    console.log('i: ', i, ' spawn: ', JSON.stringify(spawn));
    this.collectables.add(
      new Egg({
        scene: this.scene,
        x: this.collectableSpawns[i].x,
        y: this.collectableSpawns[i].y,
        texture: 'egg'
      })
    );
  }
}
