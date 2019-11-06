'use strict';

import 'phaser';
import Map from '../game-objects/map';

var instance: SettingsManager;

type PlayerConfig = {
  id: string
  keys: number[],
  color: number
}

type MapConfig = {
  id: string;
  map: Map;
  enabled: boolean;
}

export default class SettingsManager {
  playerSettings: PlayerConfig[];
  maps: MapConfig[];
  scoreLimit: number;

  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton SettingsManager');
    this.playerSettings = [];
    this.maps = [];
    this.scoreLimit = 3;
  }

  static getInstance() {
    if(instance === undefined) {
      instance = new SettingsManager();
    }
    return instance;
  }
}