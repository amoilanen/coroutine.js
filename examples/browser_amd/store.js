'use strict';

define(function() {

  var DELAY_MS = 100;

  function delay(func) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(func());
      }, DELAY_MS);
    });
  }

  class Store {

    constructor() {
      this.values = {};
    }

    insert(key, value) {
      return delay(() => {
        this.values[key] = value;
      });
    }

    get(key) {
      return delay(() => this.values[key]);
    }

    clear() {
      return delay(() => {
        self.values = {};
      });
    }
  }

  return Store;
});