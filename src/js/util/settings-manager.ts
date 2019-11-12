'use strict';

import 'phaser';
import Map from '../game-objects/map';

var instance: SettingsManager;

const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

const DEFAULT_PLAYER_CONFIGS = [
  {
    id: 'P1',
    color: 0xff0000,
    keys: [KeyCodes.LEFT, KeyCodes.UP, KeyCodes.RIGHT]
  },
  { id: 'P2', color: 0x00ff00, keys: [KeyCodes.A, KeyCodes.S, KeyCodes.D] },
  { id: 'P3', color: 0x0000ff, keys: [KeyCodes.J, KeyCodes.K, KeyCodes.L] }
];

const DEFAULT_MAP_SETTINGS = [
  {
    id: 'map1',
    mapDataKey: 'mapdata-1',
    tileMapName: 'map-tilesheet',
    tileMapKey: 'tilemap',
    enabled: true
  },
  {
    id: 'map2',
    mapDataKey: 'mapdata-2',
    tileMapName: 'map-tilesheet',
    tileMapKey: 'tilemap',
    enabled: true
  }
];

const DEFAULT_SCORE_LIMIT = 3;

type PlayerConfig = {
  id: string;
  keys: number[];
  color: number;
};

type MapConfig = {
  id: string;
  mapDataKey: string;
  tileMapName: string;
  tileMapKey: string;
  enabled: boolean;
};

export default class SettingsManager {
  playerSettings: PlayerConfig[];
  maps: MapConfig[];
  scoreLimit: number;

  constructor() {
    console.assert(
      instance === undefined,
      'Trying to instantiate non-Singleton SettingsManager'
    );
    this.playerSettings = DEFAULT_PLAYER_CONFIGS;
    this.maps = DEFAULT_MAP_SETTINGS;
    this.scoreLimit = DEFAULT_SCORE_LIMIT;
  }

  getSettingsForPlayer(playerId: string): PlayerConfig {
    return this.playerSettings.find(s => s.id === playerId);
  }

  getMapConfig(mapId) {
    return this.maps.find(m => m.id === mapId);
  }

  getEnabledMaps(): string[] {
    return this.maps.filter(m => m.enabled).map(m => m.id);
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new SettingsManager();
    }
    return instance;
  }
}
