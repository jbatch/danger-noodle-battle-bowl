'use strict'

import {Snake} from './snake';
import 'phaser';

export default interface Collectable extends Phaser.GameObjects.GameObject{
  collect(player: Snake): void;
}