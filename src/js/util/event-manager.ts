'use strict';

import { EventEmitter } from "events";

var instance: EventManager;

export default class EventManager extends Phaser.Events.EventEmitter {
  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton EventManager');
    super();
  }

  static getInstance() {
    if(instance === undefined) {
      instance = new EventManager();
    }
    return instance;
  }
}