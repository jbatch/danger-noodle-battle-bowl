'use strict'

import 'phaser';
import {Snake} from './snake';

export interface Activateable {
  activate();
}

export type Constructor<T> = {
  new(...args: any[]): T;
};

export interface Collectable extends Phaser.GameObjects.GameObject{
  spawnId: number;
  collect(player: Snake): void;
}

export interface Collider {
  onWallCollide();
  onPlayerBodyCollide();
  onPlayerHeadCollide();
} 