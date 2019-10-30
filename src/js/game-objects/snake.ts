'use strict';

import 'phaser';

type SnakeProps = {
  scene: Phaser.Scene;
  keys: Phaser.Input.Keyboard.Key[];
  children?: Phaser.GameObjects.GameObject[];
  config?: Phaser.Types.GameObjects.Group.GroupConfig;
  headConfig?: {color?: number}
};

type HeadProps = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: number;
  alpha?: number;
};
class Head extends Phaser.GameObjects.Rectangle {
  public body!: Phaser.Physics.Arcade.Body;
  constructor({
    scene,
    x,
    y,
    height = 50,
    width = 50,
    color = 0xff000,
    alpha = 1.0
  }) {
    super(scene, x, y, height, width, color, alpha);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
  }
}

export default class Snake extends Phaser.GameObjects.Group {
  moving: boolean;
  head: Head;
  left: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  angle: number;
  speed: number;
  turnSpeed: number;
  constructor({ scene, keys, children, config, headConfig = {} }: SnakeProps) {
    super(scene, children, config);
    console.assert(
      keys.length === 3,
      'Need exactly three keys to construct Snake'
    );
    this.moving = false;
    this.left = keys[0];
    this.up = keys[1];
    this.right = keys[2];
    this.angle = 0;
    this.speed = 200;
    this.turnSpeed = 3;

    this.head = new Head({ scene, x: 100, y: 100, color: headConfig.color });

    this.scene.add.existing(this.head);
    this.children.each(c => this.scene.add.existing(c));
  }

  update() {
    if (this.up.isDown) {
      this.moving = true;
    }
    if (this.left.isDown) {
      this.angle -= this.turnSpeed;
    }
    if (this.right.isDown) {
      this.angle += this.turnSpeed;
    }
    if (this.moving) {
      this.scene.physics.velocityFromAngle(
        this.angle,
        this.speed,
        this.head.body.velocity
      );
    }
    this.scene.physics.world.wrap(this.head, 30);
  }
}
