'use strict';

import 'phaser';
import { Collectable, Collider } from './interfaces';
import EventManager from '../util/event-manager';
import { Snake } from './snake';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  spawnId: number;
  texture?: string;
  frame?: string | integer;
};

export class Grenade extends Phaser.GameObjects.Image implements Collectable {
  spawnId: number;
  eventManager: EventManager;
  constructor({ scene, x, y, spawnId, texture, frame }: Props) {
    super(scene, x, y, texture || 'grenade', frame);
    this.spawnId = spawnId;
    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);
    var body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setCircle(22);
    body.setOffset(11);
    this.setScale(0.5);
    this.scene.add.existing(this);
  }

  collect(player: Snake) {
    this.eventManager.emit('ITEM_COLLECTED', {
      player: player.id,
      spawnId: this.spawnId,
      item: 'grenade'
    });
    this.destroy();
  }
}

type ThrownGrenadeProps = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  angle: number;
  speed: number;
};
export class ThrownGrenade extends Phaser.GameObjects.Image {
  public body!: Phaser.Physics.Arcade.Body;
  eventManager: EventManager;
  x: number;
  y: number;
  angle: number;
  speed: number;
  
  constructor({ scene, x, y, angle,speed }: ThrownGrenadeProps) {
    super(scene, x, y, 'grenade');
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.setScale(0.5);
    var tween = scene.tweens.add({
      targets: this,
      scale: { from: 0.5, to: 1 },
      ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 500,
      repeat: 0, // -1: infinity
      yoyo: true,
      onComplete: this.explode,
      onCompleteScope: this
    });
    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);

    var body = this.body as Phaser.Physics.Arcade.Body;

    body.setBounce(1, 1);
    body.setAllowGravity(false);
    body.setCircle(5);
    body.setOffset(this.width / 2, this.height / 2);
    body.setCollideWorldBounds(true);
    this.scene.add.existing(this);
    this.scene.physics.velocityFromAngle(this.angle, speed, body.velocity);
  }

  explode() {
    new Explosion({
      scene: this.scene,
      x: this.body.x,
      y: this.body.y
    });
    this.destroy();
  }

  update() {}
}

type ExplosionProps = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};
export class Explosion extends Phaser.GameObjects.Sprite implements Collider {
  public body!: Phaser.Physics.Arcade.Body;
  eventManager: EventManager;
  x: number;
  y: number;
  r: number;

  constructor({ scene, x, y }: ExplosionProps) {
    super(scene, x, y, 'explosion');

    this.x = x;
    this.y = y;
    this.r = 5;
    this.setAlpha(1);
    this.setScale(1);
    this.setOrigin(0.5, 0.5);
    this.play('explode');

    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);

    var body = this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setCircle(5);
    body.setOffset(this.displayWidth / 2, this.displayHeight / 2);

    var tween = scene.tweens.add({
      targets: this,
      r: { from: 1, to: 20 },
      ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 300,
      repeat: 0, // -1: infinity
      yoyo: true,
      onUpdate: () => {
        this.body.setCircle(
          this.r,
          this.displayWidth / 2 - this.r,
          this.displayHeight / 2 - this.r
        );
      },
      onUpdateScope: this,
      onComplete: () => this.destroy(),
      onCompleteScope: this
    });
    this.scene.add.existing(this);
    this.eventManager.emit('NEW_COLLIDER', this);
  }

  onWallCollide() {}
  onPlayerBodyCollide() {}
  onPlayerHeadCollide() {}
}
