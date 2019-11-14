'use strict'

import 'phaser';
import {Collectable} from './collectable';
import EventManager from '../util/event-manager';
import {Snake} from './snake';

type Props = {
  scene: Phaser.Scene;
  x: number,
  y: number,
  texture?: string;
  frame?: string | integer;
};

export default class Egg extends Phaser.GameObjects.Image implements Collectable {
  eventManager: EventManager;
  constructor({scene, x, y, texture, frame}: Props) {
    super(scene, x, y, texture || 'egg', frame);
    this.eventManager = EventManager.getInstance();
    this.scene.physics.world.enable(this);
    var body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false);
    body.setCircle(22);
    body.setOffset(11);
    this.setScale(0.5);
    this.scene.add.existing(this);
  }

  collect(player: Snake) {
    this.eventManager.emit('EGG_COLLECTED', player.id);
    this.destroy();
  }
}