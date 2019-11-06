'use strict';

var instance: SettingsManager;

export default class SettingsManager {
  constructor() {
    console.assert(instance === undefined, 'Trying to instantiate non-Singleton SettingsManager');
  }

  static getInstance() {
    if(instance === undefined) {
      instance = new SettingsManager();
    }
    return instance;
  }
}