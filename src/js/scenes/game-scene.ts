'use strict';

import 'phaser';
import Snake from '../game-objects/snake';

export default class GameScene extends Phaser.Scene {
  snake: Snake;
  snake2: Snake;
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
    this.initPlayers();
    this.initMap();

    // var rec = this.physics.add.rectangle(200, 200, 100, 100, 0x00ff00, 1);
    this.physics.add.collider(this.snake.head, this.staticLayer, () =>
      console.log('collide')
    );
    this.physics.add.collider(this.snake2.head, this.staticLayer, () =>
      console.log('collide')
    );
    this.physics.add.collider(this.snake.head, this.snake2.head, () =>
      console.log('collide')
    );
  }

  initPlayers() {
    this.snake = new Snake({
      scene: this,
      keys: [
        this.input.keyboard.addKey('A'),
        this.input.keyboard.addKey('S'),
        this.input.keyboard.addKey('D')
      ]
    });
    this.snake2 = new Snake({
      scene: this,
      keys: [
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
      ],
      headConfig: { color: 0xff0000 }
    });
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

  update() {
    this.snake.update();
    this.snake2.update();
  }
}
