'use strict';

import 'phaser';
import Player from './player';
import EventManager from '../util/event-manager';

var FOLLOW_DISTANCE = 10;

type SnakeProps = {
  scene: Phaser.Scene;
  player: Player;
  color: number;
};

export class Head extends Phaser.GameObjects.Rectangle {
  public body!: Phaser.Physics.Arcade.Body;
  public next: Body;
  public parent: Snake;
  constructor({
    scene,
    x,
    y,
    parent,
    height = 10,
    width = 10,
    color = 0xff000,
    alpha = 0.5
  }) {
    super(scene, x, y, height, width, color, alpha);
    this.parent = parent;
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.body.setSize(7, 7);
  }

  freeze() {
    this.body.setVelocity(0);
    if (this.next !== undefined) {
      this.next.freeze();
    }
  }
}

export class Body extends Phaser.GameObjects.Rectangle {
  public body!: Phaser.Physics.Arcade.Body;
  public parent: Snake;
  public next: Body;
  public previous: Phaser.GameObjects.Shape;
  constructor({
    scene,
    x,
    y,
    parent,
    previous,
    height = 10,
    width = 10,
    color = 0xff000,
    alpha = 0.5
  }) {
    super(scene, x, y, height, width, color, alpha);
    this.parent = parent;
    this.previous = previous;
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.body.setSize(7, 7);
    this.body.setImmovable(true);
  }

  setNext(next: Body) {
    this.next = next;
  }

  freeze() {
    this.body.setVelocity(0);
    if (this.next !== undefined) {
      this.next.freeze();
    }
  }

  update() {
    this.fillAlpha = this.previous.fillAlpha;
    if (
      !this.parent.jumping &&
      this.parent.moving &&
      this.distanceToPrevious() >= FOLLOW_DISTANCE
    ) {
      // Move next first
      if (this.next != undefined) {
        this.next.update();
      }
      this.setPosition(this.previous.x, this.previous.y);
    }

    this.scene.physics.world.wrap(this, 0);
  }

  // return the value closest to goal.
  getClosest(goal, ...args): number {
    return args.reduce(function(prev, curr) {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });
  }

  distanceToPrevious() {
    return Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.previous.x,
      this.previous.y
    );
  }
}

export class Snake {
  scene: Phaser.Scene;
  eventManager: EventManager;
  id: string;
  moving: boolean;
  jumping: boolean;
  alive: boolean;
  invulnerabilityRemaining: number;
  head: Head;
  bodies: Body[];
  tail: Body;
  left: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  angle: number;
  speed: number;
  turnSpeed: number;
  constructor({ scene, player, color }: SnakeProps) {
    this.scene = scene;
    this.id = player.id;
    this.eventManager = EventManager.getInstance();
    this.eventManager.on('EGG_COLLECTED', this.handleEggCollected, this);
    this.moving = false;
    this.jumping = false;
    this.alive = true;
    this.invulnerabilityRemaining = 2000;
    this.left = this.scene.input.keyboard.addKey(player.keys[0]);
    this.up = this.scene.input.keyboard.addKey(player.keys[1]);
    this.right = this.scene.input.keyboard.addKey(player.keys[2]);
    this.angle = 0;
    this.speed = 100;
    this.turnSpeed = 5;

    this.bodies = [];
    this.head = new Head({
      scene,
      parent: this,
      x: 0,
      y: 0,
      color
    });

    this.scene.add.existing(this.head);
  }

  destroy() {

  }

  handleEggCollected(playerId: String) {
    if (playerId === this.id) {
      this.grow();
      this.grow();
      this.grow();
      this.grow();
      this.grow();
    }
  }

  grow() {
    const previous = this.tail === undefined ? this.head : this.tail;
    const newBody = new Body({
      scene: this.scene,
      x: previous.x,
      y: previous.y,
      parent: this,
      previous,
      color: this.head.fillColor
    });
    this.bodies.push(newBody);
    previous.next = newBody;
    this.tail = newBody;
    this.scene.add.existing(newBody);
    this.eventManager.emit('NEW_BODY', newBody);
    this.speed += 2;
  }

  collide() {
    console.log('collide')
    if (this.invulnerabilityRemaining <= 0 && !this.jumping) {
      this.moving = false;
      this.alive = false;
      this.head.freeze();
      this.scene.physics.world.disable(this.head);
      this.eventManager.emit('PLAYER_DEATH', this.id);
    }
  }

  collideBody(body: Body) {
    // Ignore hits with a heads first body part
    if (body.parent === this && body === this.head.next) {
      return;
    }
    if (this.invulnerabilityRemaining <= 0 && !this.jumping) {
      this.moving = false;
      this.alive = false;
      this.head.freeze();
      this.scene.physics.world.disable(this.head);
      this.eventManager.emit('PLAYER_DEATH', this.id);
    }
  }

  update(time, delta) {
    if (this.moving && this.invulnerabilityRemaining > 0) {
      this.head.fillAlpha = 0.5;
      this.invulnerabilityRemaining -= delta;
    } else {
      this.head.fillAlpha = 1.0;
    }
    if (Phaser.Input.Keyboard.JustDown(this.up)) {
      if (!this.moving) {
        this.moving = true;
      } else {
        this.jumping = true;
        var timer = this.scene.time.delayedCall(
          1000,
          () => (this.jumping = false),
          undefined,
          this
        );
      }
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

    if (this.moving && this.head.next !== undefined) {
      this.head.next.update();
    }
    this.scene.physics.world.wrap(this.head, 0);
    if (Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('Z'))) {
      FOLLOW_DISTANCE++;
      console.log('follow distance: ', FOLLOW_DISTANCE);
    }
    if (Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('X'))) {
      FOLLOW_DISTANCE--;
      console.log('follow distance: ', FOLLOW_DISTANCE);
    }
  }
}
