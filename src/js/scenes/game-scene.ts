'use strict';

import 'phaser';
import {Snake, Head} from '../game-objects/snake';
import EventManager from '../util/event-manager';

export default class GameScene extends Phaser.Scene {
  eventManager: EventManager;
  snakes: Snake[];
  heads: Phaser.GameObjects.Group;
  bodies: Phaser.GameObjects.Group;
  powerUps: Phaser.GameObjects.Group;
  staticLayer: Phaser.Tilemaps.StaticTilemapLayer;

  constructor() {
    super('GameScene');
  }

  init() {}

  preload() {
    this.load.image('tilemap', './media/map-tilesheet.png');
    this.load.tilemapTiledJSON('mapdata', './data/map-1.json');
  }

  create() {
    this.eventManager = EventManager.getInstance();
    this.snakes = [];
    this.heads = this.add.group();
    this.bodies = this.add.group();
    this.powerUps = this.add.group();
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
      headConfig: { color: 0xff0000 }
    });
    this.heads.add(snake2.head);
    this.bodies.addMultiple(snake2.bodies);
    this.snakes.push(snake2);
  }

  initMap() {
    const tilemap = this.make.tilemap({ key: 'mapdata' });
    const tileset = tilemap.addTilesetImage('map-tilesheet', 'tilemap');

    // Create layers
    this.staticLayer = tilemap.createStaticLayer('static', tileset, 0, 0);
    this.staticLayer.setCollisionByProperty({ solid: true });
    // var debugGraphics = this.add.graphics();
    // this.staticLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
    // });
  }

  initColliders() {
    this.physics.add.collider(this.heads, this.staticLayer, (head) =>
      (head as Head).parent.collide()
    );
    this.physics.add.collider(this.heads, this.heads, () =>
      console.log('collide')
    );
    this.physics.add.collider(this.heads, this.bodies, () => undefined);
  }

  update(time, delta) {
    for (var snake of this.snakes) {
      snake.update(time, delta);
    }
  }
}
