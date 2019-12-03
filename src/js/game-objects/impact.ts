'use strict';

import { Collider } from './interfaces';
import EventManager from '../util/event-manager';

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  owner: string;
  startingRadius: number;
  maxRadius: number;
};

export class Impact extends Phaser.GameObjects.Arc implements Collider {
  public body!: Phaser.Physics.Arcade.Body;
  x: number;
  y: number;
  owner: string;
  startingRadius: number;
  maxRadius: number;

  constructor({ scene, x, y, owner, startingRadius, maxRadius }: Props) {
    super(scene, x, y, startingRadius);
    this.setStrokeStyle(2, 0xffffff, 1);
    this.owner = owner;
    this.maxRadius = maxRadius;
    this.setOrigin(0.5, 0.5);
    
    this.scene.physics.world.enable(this);
    this.body.setCircle(5);
    // this.body.setOffset(this.displayWidth / 2, this.displayHeight / 2);
    EventManager.getInstance().emit('NEW_COLLIDER', this);
    this.scene.tweens.add({
      targets: this,
      radius: { from: this.startingRadius, to: this.maxRadius },
      ease: 'Linear',
      duration: 500,
      repeat: 0,
      yoyo: false,
      onUpdate: () => {
        this.body.setCircle(
          this.radius,
          this.displayWidth / 2 - this.radius,
          this.displayHeight / 2 - this.radius
        );
        // this.body.setOffset(this.displayWidth / 2, this.displayHeight / 2);
      },
      onUpdateScope: this,
      onComplete: () => this.destroy(),
      onCompleteScope: this
    });
    this.scene.add.existing(this);
  }

  onWallCollide() {}
  onPlayerBodyCollide() {}
  onPlayerHeadCollide() {}
}
