'use strict';

import 'phaser';
import { Collectable } from './collectable';
import EventManager from '../util/event-manager';
import { Snake } from './snake';
import Collider from './collider';
import KeyCodes from 'phaser/src/input/keyboard/keys/KeyCodes';
import { Activateable } from './interfaces';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  spawnId: number;
  texture?: string;
  frame?: string | integer;
};

export class C4 extends Phaser.GameObjects.Image implements Collectable {
  spawnId: number;
  eventManager: EventManager;
  constructor({ scene, x, y, spawnId, texture, frame }: Props) {
    super(scene, x, y, texture || 'c4', frame);
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
      item: 'c4'
    });
    this.destroy();
  }
}

type PlacedC4Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};
export class PlacedC4 extends Phaser.GameObjects.Image implements Activateable {
  public body!: Phaser.Physics.Arcade.Body;
  eventManager: EventManager;
  x: number;
  y: number;
  constructor({ scene, x, y }: PlacedC4Props) {
    super(scene, x, y, 'c4');
    this.x = x;
    this.y = y;
    this.setScale(0.5);

    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);

    var body = this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setCircle(5);
    this.scene.add.existing(this);
  }

  activate() {
    new Explosion({
      scene: this.scene,
      x: this.body.x + 30,
      y: this.body.y + 30
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
export class Explosion extends Phaser.GameObjects.Image implements Collider {
  public body!: Phaser.Physics.Arcade.Body;
  eventManager: EventManager;
  x: number;
  y: number;
  r: number;

  constructor({ scene, x, y }: ExplosionProps) {
    super(scene, x, y, 'c4');

    this.x = x;
    this.y = y;
    this.r = 5;
    this.setAlpha(0);
    this.setScale(0.5);
    this.setOrigin(0.5, 0.5);

    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);

    var body = this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setOffset(this.width / 2, this.height / 2);
    body.setCircle(5);

    // body.center

    var tween = scene.tweens.add({
      targets: this,
      r: { from: 5, to: 60 },
      ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 100,
      repeat: 0, // -1: infinity
      yoyo: true,
      onUpdate: () => {
        this.body.setCircle(this.r, -this.r, -this.r);
      },
      onUpdateScope: this,
      onComplete: () => this.destroy(),
      onCompleteScope: this
    });
    // body.setOffset(this.width/2, this.height/2);
    body.setCollideWorldBounds(true);
    this.scene.add.existing(this);
    this.eventManager.emit('NEW_COLLIDER', this);
  }

  onWallCollide() {}
  onPlayerBodyCollide() {}
  onPlayerHeadCollide() {}
}
