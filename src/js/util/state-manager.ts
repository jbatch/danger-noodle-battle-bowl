'use strict';

import EventManager from './event-manager';
import Player from '../game-objects/player';

var instance: StateManager;

export class StateManager {
  eventManager: EventManager;
  state: State;

  constructor() {
    console.assert(
      instance === undefined,
      'Trying to instantiate non-Singleton StateManager'
    );
    this.eventManager = EventManager.getInstance();
    this.state = new State();

    this.eventManager.on('PLAYER_JOIN', this.handlePlayerJoin, this);
  }

  static getInstance() {
    if (instance === undefined) {
      instance = new StateManager();
    }
    return instance;
  }

  handlePlayerJoin(p: Player) {
    this.state.addPlayer(p);
  }
}

type Score = { id: string; score: number };
export class State {
  private scores: Score[];
  private currentMap: string;
  constructor() {
    this.scores = [];
    this.currentMap = 'map1';
  }

  getCurrentMap() {
    return this.currentMap;
  }

  setCurrentMap(map: string) {
    this.currentMap = map;
  }

  addPlayer(p: Player): void {
    if (this.getScoreForPlayer(p.id) === undefined) {
      this.scores.push({ id: p.id, score: 0 });
    }
  }

  playerAboveScore(goal: number): string | undefined {
    for (var score of this.scores) {
      if (score.score >= goal) {
        return score.id;
      }
    }
    return undefined;
  }

  playerGainPoint(playerId: string): void {
    this.getScoreForPlayer(playerId).score++;
    console.log(JSON.stringify(this.scores));
  }

  getScoreForPlayer(playerId: string): Score {
    for (var s of this.scores) {
      if (s.id === playerId) {
        return s;
      }
    }
    return undefined;
  }

  getScores(): Score[] {
    // only return a copy of the scores;
    return [...this.scores];
  }

  getPlayersList(): string[] {
    return this.scores.map(s => s.id);
  }
}
