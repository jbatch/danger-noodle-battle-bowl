'use strict'

import {Snake} from './snake';
import 'phaser';

export type Constructor<T> = {
  new(...args: any[]): T;
};

export interface Collectable extends Phaser.GameObjects.GameObject{
  collect(player: Snake): void;
}