'use strict';

import 'phaser';
import Egg from '../game-objects/egg';
import { Grenade } from '../game-objects/grenade';
import { Laser } from '../game-objects/laser';
import { Constructor, Collectable } from '../game-objects/interfaces';
import { C4 } from '../game-objects/c4';

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
    enabled: false
  }
];

const DEFAULT_ITEM_SETTINGS = [
  { id: 'egg', enabled: false, constructor: Egg },
  { id: 'laser', enabled: false, constructor: Laser },
  { id: 'grenade', enabled: false, constructor: Grenade },
  { id: 'c4', enabled: true, constructor: C4 }
];

const DEFAULT_SCORE_LIMIT = 3;

type PlayerConfig = {
  id: string;
  keys: number[];
  color: number;
};

export type MapConfig = {
  id: string;
  mapDataKey: string;
  tileMapName: string;
  tileMapKey: string;
  enabled: boolean;
};

export type ItemConfig = {
  id: string;
  enabled: boolean;
  constructor: Constructor<Collectable>;
};

export class SettingsManager {
  playerSettings: PlayerConfig[];
  maps: MapConfig[];
  items: ItemConfig[];
  scoreLimit: number;

  constructor() {
    console.assert(
      instance === undefined,
      'Trying to instantiate non-Singleton SettingsManager'
    );
    this.playerSettings = DEFAULT_PLAYER_CONFIGS;
    this.maps = DEFAULT_MAP_SETTINGS;
    this.items = DEFAULT_ITEM_SETTINGS;
    this.scoreLimit = DEFAULT_SCORE_LIMIT;
  }

  toggleItem(itemId: string) {
    const item = this.items.find(i => i.id === itemId);
    item.enabled = !item.enabled;
    return item.enabled;
  }

  toggleMap(mapId: string) {
    const map = this.maps.find(i => i.id === mapId);
    map.enabled = !map.enabled;
    return map.enabled;
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

  getEnabledItems(): Constructor<Collectable>[] {
    return this.items.filter(i => i.enabled).map(i => i.constructor);
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new SettingsManager();
    }
    return instance;
  }
}
