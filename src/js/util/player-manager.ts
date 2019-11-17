'use strict';

import 'phaser';
import EventManager from './event-manager';
import Player from '../game-objects/player';
var instance: PlayerManager;

const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export default class PlayerManager {
  scene: Phaser.Scene;
  eventManager: EventManager;
  players: Player[];
  p1JoinKey: Phaser.Input.Keyboard.Key;
  p2JoinKey: Phaser.Input.Keyboard.Key;
  p3JoinKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    console.assert(
      instance === undefined,
      'Trying to instantiate non-Singleton PlayerManager'
    );
    this.scene = scene;
    this.eventManager = EventManager.getInstance();
    this.players = [];
    this.p1JoinKey = scene.input.keyboard.addKey(KeyCodes.UP);
    this.p2JoinKey = scene.input.keyboard.addKey(KeyCodes.S);
    this.p3JoinKey = scene.input.keyboard.addKey(KeyCodes.K);
    this.eventManager.on('NEW_ROUND', this.resetPlayers, this);
  }

  resetPlayers() {
    const players = this.players.map(p => p.id);
    this.eventManager.removeAllListeners('EGG_COLLECTED');
    this.eventManager.removeAllListeners('LASER_COLLECTED');
    this.eventManager.removeAllListeners('GRENADE_COLLECTED');
    for(var player of this.players) {
      
    }
    this.players = [];
    for (var id of players) {
      this.playerJoin(id);
    }
  }

  playerJoin(id) {
    const player = new Player(this.scene, id);
    this.players.push(player);
    this.eventManager.emit('PLAYER_JOIN', player);
  }

  static getInstance(scene: Phaser.Scene) {
    if (instance === undefined) {
      instance = new PlayerManager(scene);
    }
    return instance;
  }

  update() {
    const playerIds = this.players.map(p => p.id);
    // P1
    if (
      !playerIds.includes('P1') &&
      Phaser.Input.Keyboard.JustDown(this.p1JoinKey)
    ) {
      this.playerJoin('P1');
    }
    // P2
    if (
      !playerIds.includes('P2') &&
      Phaser.Input.Keyboard.JustDown(this.p2JoinKey)
    ) {
      this.playerJoin('P2');
    }
    // P3
    if (
      !playerIds.includes('P3') &&
      Phaser.Input.Keyboard.JustDown(this.p3JoinKey)
    ) {
      this.playerJoin('P3');
    }
  }
}
