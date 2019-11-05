'use strict';

import 'phaser';
import { Snake, Head, Body } from '../game-objects/snake';
import Egg from '../game-objects/egg';
import EventManager from '../util/event-manager';
import Collectable from '../game-objects/collectable';
import Map from '../game-objects/map';
import Player from '../game-objects/player';

export default class GameScene extends Phaser.Scene {
  eventManager: EventManager;
  snakes: Snake[];
  heads: Phaser.GameObjects.Group;
  bodies: Phaser.GameObjects.Group;
  map: Map;

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
    this.map = new Map(this);
    this.initPlayers();
    this.initColliders();
  }

  initPlayers() {
    var player1 = new Player(this, 'P1');
    this.heads.add(player1.snake.head);
    this.snakes.push(player1.snake);

    var player2 = new Player(this, 'P2');
    this.heads.add(player2.snake.head);
    this.snakes.push(player2.snake);

    this.eventManager.on(
      'NEW_BODY',
      (body: Body) => this.bodies.add(body),
      this
    );
  }

  initColliders() {
    this.physics.add.collider(
      this.heads,
      this.map.staticLayer,
      (head: Head) => head.parent.collide(),
      (head: Head) => !head.parent.jumping
    );
    this.physics.add.overlap(
      this.heads,
      this.map.staticLayer,
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
      this.map.collectables,
      (head: Head, collectable: Collectable) => collectable.collect(head.parent)
    );
  }

  update(time, delta) {
    // console.log('Frame Rate: ', (1000 / delta).toFixed(2), 'FPS. Bodies: ', this.bodies.children.size);
    for (var snake of this.snakes) {
      snake.update(time, delta);
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('E'))) {
      this.map.spawnCollectable();
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('G'))) {
      this.snakes.forEach((snake: Snake) => snake.grow());
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('R'))) {
      this.scene.restart();
    }
  }
}
