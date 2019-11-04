'use strict';

import 'phaser';
import { Snake, Head, Body } from '../game-objects/snake';
import Egg from '../game-objects/egg';
import EventManager from '../util/event-manager';
import Collectable from '../game-objects/collectable';

export default class GameScene extends Phaser.Scene {
  eventManager: EventManager;
  snakes: Snake[];
  heads: Phaser.GameObjects.Group;
  bodies: Phaser.GameObjects.Group;
  collectables: Phaser.GameObjects.Group;
  staticLayer: Phaser.Tilemaps.StaticTilemapLayer;
  playerSpawns: { x: number; y: number }[];
  collectableSpawns: { x: number; y: number }[];

  constructor() {
    super('GameScene');
  }

  init() {}

  preload() {
    this.load.image('tilemap', './media/map-tilesheet.png');
    this.load.image('egg', './media/egg.png');
    this.load.tilemapTiledJSON('mapdata', './data/map-1.json');
  }

  create() {
    this.eventManager = EventManager.getInstance();
    this.snakes = [];
    this.heads = this.add.group();
    this.bodies = this.add.group();
    this.collectables = this.add.group();
    this.playerSpawns = [];
    this.collectableSpawns = [];
    this.initMap();
    this.initPlayers();
    this.initColliders();
  }

  initPlayers() {
    // var snake = new Snake({
    //   scene: this,
    //   keys: [
    //     this.input.keyboard.addKey('A'),
    //     this.input.keyboard.addKey('S'),
    //     this.input.keyboard.addKey('D')
    //   ],
    //   id: 'Player 2'
    // });
    // this.heads.add(snake.head);
    // this.bodies.addMultiple(snake.bodies);
    // this.snakes.push(snake);

    var snake2 = new Snake({
      scene: this,
      keys: [
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
      ],
      headConfig: { color: 0xff0000 },
      id: 'Player 1'
    });
    this.heads.add(snake2.head);
    this.eventManager.on(
      'NEW_BODY',
      (body: Body) => this.bodies.add(body),
      this
    );
    this.snakes.push(snake2);
  }

  initMap() {
    const tilemap = this.make.tilemap({ key: 'mapdata' });
    const tileset = tilemap.addTilesetImage('map-tilesheet', 'tilemap');

    // Create layers
    this.staticLayer = tilemap.createStaticLayer('static', tileset, 0, 0);
    this.staticLayer.setCollisionByProperty({ solid: true });

    // Get object data
    const playerObjects = tilemap.createFromObjects(
      'object',
      'player',
      {},
      this
    );

    for (var o of playerObjects) {
      this.playerSpawns.push({ x: o.x, y: o.y });
      o.destroy();
    }
    console.log(this.playerSpawns);

    const collectableObjects = tilemap.createFromObjects(
      'object',
      'collectable',
      {},
      this
    );
    for (var o of collectableObjects) {
      this.collectableSpawns.push({ x: o.x, y: o.y });
      o.destroy();
    }
    console.log(this.collectableSpawns);
  }

  initColliders() {
    this.physics.add.collider(
      this.heads,
      this.staticLayer,
      (head: Head) => head.parent.collide(),
      (head: Head) => !head.parent.jumping
    );
    this.physics.add.overlap(
      this.heads,
      this.staticLayer,
      (head: Head) => head.parent.collide(),
      (head: Head, other: any) => !head.parent.jumping && other.index != -1
    );
    this.physics.add.collider(this.heads, this.heads, () =>
      console.log('collide')
    );
    this.physics.add.collider(
      this.heads,
      this.bodies,
      (head: Head, body: Body) => head.parent.collideBody(body),
      (head: Head) => !head.parent.jumping
    );
    this.physics.add.overlap(
      this.heads,
      this.collectables,
      (head: Head, collectable: Collectable) => collectable.collect(head.parent)
    );
  }

  spawnCollectable() {
    const i = Phaser.Math.Between(0, this.collectableSpawns.length - 1);
    console.log(i);
    var spawn = this.collectableSpawns[i];
    console.log('i: ', i, ' spawn: ', JSON.stringify(spawn));
    this.collectables.add(
      new Egg({
        scene: this,
        x: this.collectableSpawns[i].x,
        y: this.collectableSpawns[i].y,
        texture: 'egg'
      })
    );
  }

  update(time, delta) {
    // console.log('Frame Rate: ', (1000 / delta).toFixed(2), 'FPS. Bodies: ', this.bodies.children.size);
    for (var snake of this.snakes) {
      snake.update(time, delta);
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('E'))) {
      this.spawnCollectable();
    }
  }
}
