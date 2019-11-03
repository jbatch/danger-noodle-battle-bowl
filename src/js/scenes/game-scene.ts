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
    this.initPlayers();
    this.initMap();
    this.initColliders();
  }

  initPlayers() {
    // var snake = new Snake({
    //   scene: this,
    //   keys: [
    //     this.input.keyboard.addKey('A'),
    //     this.input.keyboard.addKey('S'),
    //     this.input.keyboard.addKey('D')
    //   ]
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
    this.eventManager.on('NEW_BODY', (body: Body) => this.bodies.add(body), this);
    this.snakes.push(snake2);
  }

  initMap() {
    const tilemap = this.make.tilemap({ key: 'mapdata' });
    const tileset = tilemap.addTilesetImage('map-tilesheet', 'tilemap');

    // Create layers
    this.staticLayer = tilemap.createStaticLayer('static', tileset, 0, 0);
    this.staticLayer.setCollisionByProperty({ solid: true });
  }

  initColliders() {
    this.physics.add.collider(this.heads, this.staticLayer, (head: Head) =>
      head.parent.collide()
    );
    this.physics.add.collider(this.heads, this.heads, () =>
      console.log('collide')
    );
    this.physics.add.collider(this.heads, this.bodies, (head: Head, body: Body) => head.parent.collideBody(body));
    this.physics.add.overlap(
      this.heads,
      this.collectables,
      (head: Head, collectable: Collectable) => collectable.collect(head.parent)
    );
  }

  spawnCollectable() {
    this.collectables.add(new Egg({scene: this, x: 300, y: 300, texture: 'egg'}));
  }

  update(time, delta) {
    console.log('Frame Rate: ', (1000 / delta).toFixed(2), 'FPS. Bodies: ', this.bodies.children.size);
    for (var snake of this.snakes) {
      snake.update(time, delta);
    }
    if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('E'))) {
      this.spawnCollectable();
    }
  }
}
