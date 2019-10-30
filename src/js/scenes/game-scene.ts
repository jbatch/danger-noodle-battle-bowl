'use strict';

import 'phaser';
import Snake from '../game-objects/snake';

export default class GameScene extends Phaser.Scene {
  snake: Snake;
  snake2: Snake;

  constructor() {
    super('GameScene');
  }

  init() {}

  preload() {}

  create() {
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
      headConfig: {
        color: 0xff0000}
    })
  }

  update() {
    this.snake.update();
    this.snake2.update();
  }
}
