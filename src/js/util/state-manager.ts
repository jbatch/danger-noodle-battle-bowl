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
  constructor() {
    this.scores = [];
  }

  addPlayer(p: Player) {
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

  playerGainPoint(playerId: string) {
    this.getScoreForPlayer(playerId).score++;
    console.log(JSON.stringify(this.scores));
  }

  getScoreForPlayer(playerId: string) {
    for (var s of this.scores) {
      if (s.id === playerId) {
        return s;
      }
    }
    return undefined;
  }
}
