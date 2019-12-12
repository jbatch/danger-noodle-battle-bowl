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

export class Laser extends Phaser.GameObjects.Image implements Collectable {
  spawnId: number;
  eventManager: EventManager;
  constructor({ scene, x, y, spawnId, texture, frame }: Props) {
    super(scene, x, y, texture || 'laser', frame);
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
    this.eventManager.emit('ITEM_COLLECTED', {player: player.id, spawnId: this.spawnId, item: 'laser'});
    this.destroy();
  }
}

type BeamProps = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  angle: number;
};
export class LaserBeam extends Phaser.GameObjects.Image implements Collider{
  public body!: Phaser.Physics.Arcade.Body;
  eventManager: EventManager;
  x: number;
  y: number;
  angle: number;
  bounces: number
  constructor({ scene, x, y, angle }: BeamProps) {
    super(scene, x, y, 'laserbeam');
    this.setAlpha(0);
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.bounces = 1;
    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);
    
    var body = this.body as Phaser.Physics.Arcade.Body;
 
    body.setAllowGravity(false);
    body.setCircle(5);
    body.setOffset(0);
    body.setCollideWorldBounds(true);
    this.scene.add.existing(this);

    this.scene.sound.play('laser_sound');
    this.scene.physics.velocityFromAngle(
      this.angle,
      300,
      body.velocity
    );
    if(this.bounces > 0) {
      this.body.setBounce(1,1);
    }
    this.eventManager.emit('NEW_COLLIDER', this);
  }

  onWallCollide() {
    if(this.bounces <= 0) {
      this.destroy();
    }
    this.bounces--;
  }

  onPlayerBodyCollide() {}
  onPlayerHeadCollide(){}

  update() {

  }
}
