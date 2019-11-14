'use strict';

import 'phaser';
import { Collectable } from './collectable';
import EventManager from '../util/event-manager';
import { Snake } from './snake';
import { brotliDecompress } from 'zlib';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture?: string;
  frame?: string | integer;
};

export class Laser extends Phaser.GameObjects.Image implements Collectable {
  eventManager: EventManager;
  constructor({ scene, x, y, texture, frame }: Props) {
    super(scene, x, y, texture || 'laser', frame);
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
    this.eventManager.emit('LASER_COLLECTED', player.id);
    this.destroy();
  }
}

type BeamProps = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  angle: number;
};
export class LaserBeam extends Phaser.GameObjects.Image {
  eventManager: EventManager;
  x: number;
  y: number;
  angle: number;
  constructor({ scene, x, y, angle }: BeamProps) {
    super(scene, x, y, 'laserbeam');
    this.setAlpha(0);
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);
    
    var body = this.body as Phaser.Physics.Arcade.Body;
 
    body.setAllowGravity(false);
    body.setCircle(5);
    body.setOffset(0);
    body.setCollideWorldBounds(true);
    this.scene.add.existing(this);
    this.scene.physics.velocityFromAngle(
      this.angle,
      1000,
      body.velocity
    );
    this.eventManager.emit('NEW_COLLIDER', this);
  }

  blah() {
    console.log('destroying laser');
    this.destroy();
  }

  update() {

  }
}
