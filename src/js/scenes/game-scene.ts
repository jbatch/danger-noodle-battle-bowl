'use strict';

import 'phaser';
import EventManager from '../util/event-manager';
import PlayerManager from '../util/player-manager';
import { StateManager } from '../util/state-manager';
import SettingsManager from '../util/settings-manager';
import SceneManager from '../util/scene-manager';
import Map from '../game-objects/map';
import Player from '../game-objects/player';
import { Snake, Head, Body } from '../game-objects/snake';
import { Collectable } from '../game-objects/collectable';
import { LaserBeam } from '../game-objects/laser';
import Collider from '../game-objects/collider';

export default class GameScene extends Phaser.Scene {
  eventManager: EventManager;
  stateManager: StateManager;
  playerManager: PlayerManager;
  settingsManager: SettingsManager;
  sceneManager: SceneManager;
  snakes: Snake[];
  heads: Phaser.GameObjects.Group;
  bodies: Phaser.GameObjects.Group;
  colliders: Phaser.GameObjects.Group;
  map: Map;

  constructor() {
    super('GameScene');
  }

  init() {}

  preload() {
    this.load.image('tilemap', './media/map-tilesheet.png');
    this.load.image('egg', './media/egg.png');
    this.load.image('laser', './media/laser.png');
    this.load.image('grenade', './media/grenade.png');
    this.load.image('c4', './media/c4.png');
    this.load.image('remote', './media/remote.png');
    this.load.tilemapTiledJSON('mapdata-1', './data/map-1.json');
    this.load.tilemapTiledJSON('mapdata-2', './data/map-2.json');
  }

  create(data) {
    this.cameras.main.setBackgroundColor(0x000000);
    this.eventManager = EventManager.getInstance();
    this.stateManager = StateManager.getInstance();
    this.playerManager = PlayerManager.getInstance(this);
    this.settingsManager = SettingsManager.getInstance();
    this.sceneManager = SceneManager.getInstance();
    this.snakes = [];
    this.heads = this.add.group();
    this.bodies = this.add.group();
    this.colliders = this.add.group();
    this.map = new Map(this, data.map ? data.map : 'map1');
    this.initPlayerEventListeners();
    this.initColliders();
    this.initTimers();
    this.eventManager.emit('NEW_ROUND');
  }

  initPlayerEventListeners() {
    if (this.eventManager.listenerCount('PLAYER_JOIN') === 1) {
      this.eventManager.on('PLAYER_JOIN', this.playerJoin, this);
      this.eventManager.on('NEW_BODY', (b: Body) => this.bodies.add(b), this);
      this.eventManager.on('PLAYER_DEATH', this.checkForRoundOver, this);
      this.eventManager.on(
        'NEW_COLLIDER',
        (c: Collider & Phaser.GameObjects.GameObject) => this.colliders.add(c),
        this
      );
    }
  }

  playerJoin(p: Player) {
    this.heads.add(p.snake.head);
    this.snakes.push(p.snake);
    const spawn = this.map.playerSpawns.splice(0, 1);
    if (spawn.length !== 1) {
      console.error('No spawn location for player: ' + p.id);
      return;
    }
    p.snake.head.x = spawn[0].x;
    p.snake.head.y = spawn[0].y;
    p.snake.setDirection(spawn[0].dir);
  }

  initColliders() {
    this.physics.add.collider(
      this.heads,
      this.map.staticLayer,
      (head: Head) => head.parent.collide(),
      (head: Head) => !head.parent.jumping
    );
    this.physics.add.overlap(
      this.heads,
      this.map.staticLayer,
      (head: Head) => head.parent.collide(),
      (head: Head, other: any) => !head.parent.jumping && other.index != -1
    );
    this.physics.add.collider(
      this.heads,
      this.heads,
      () => undefined,
      (head1: Head, head2: Head) =>
        !head1.parent.jumping && !head2.parent.jumping
    );
    this.physics.add.collider(
      this.heads,
      this.bodies,
      (head: Head, body: Body) => head.parent.collideBody(body),
      (head: Head) => !head.parent.jumping
    );
    this.physics.add.overlap(
      this.heads,
      this.map.collectables,
      (head: Head, collectable: Collectable) =>
        collectable.collect(head.parent),
      (head: Head, collectable: Collectable) => !head.parent.jumping
    );
    this.physics.add.overlap(
      this.heads,
      this.colliders,
      (head: Head, collider: Collider & Phaser.GameObjects.GameObject) => {
        head.parent.collide();
        collider.onPlayerHeadCollide();
      },
      (head: Head, collider: any) => !head.parent.jumping
    );
    this.physics.add.collider(
      this.map.staticLayer,
      this.colliders,
      (collider: Collider & Phaser.GameObjects.GameObject, wall: any) => {
        collider.onWallCollide();
      },
      () => true,
      this
    );
  }

  initTimers() {
    var timer = this.time.addEvent({
      delay: 2000,
      callback: () => this.map.spawnCollectable(),
      callbackScope: this,
      loop: true
    });
  }

  checkForRoundOver() {
    const snakesAlive = this.snakes.filter(s => s.alive);
    if (snakesAlive.length === 1 && this.snakes.length > 1) {
      snakesAlive[0].freeze();
      const state = this.stateManager.state;
      state.playerGainPoint(snakesAlive[0].id);
      if (state.playerAboveScore(this.settingsManager.scoreLimit)) {
        // Game Over
        this.time.delayedCall(
          1000,
          () => this.sceneManager.showGameOver(this.scene),
          undefined,
          this
        );
        return;
      }
      // Round over
      this.time.delayedCall(
        1000,
        () => this.sceneManager.showScore(this.scene),
        undefined,
        this
      );
    }
    if (snakesAlive.length === 0) {
      // Only one player, no points given.
    }
  }

  startBattle() {
    if (this.snakes.length === 0) {
      return;
    }
    for (var s of this.snakes) {
      s.moving = true;
    }
  }

  update(time, delta) {
    this.playerManager.update();
    for (var snake of this.snakes) {
      snake.update(time, delta);
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('E'))) {
      this.map.spawnCollectable();
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('G'))) {
      // this.snakes.forEach((snake: Snake) => snake.grow5());
      this.snakes[0].grow5();
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('R'))) {
      this.scene.restart();
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE'))) {
      this.startBattle();
    }
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC'))) {
      this.sceneManager.openSettings(this.scene);
      this.input.keyboard.addKey('ESC').reset();
    }
  }
}
