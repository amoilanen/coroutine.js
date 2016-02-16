define(function() {

  var DELAY_MS = 100;

  function delay(func) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(func());
      }, DELAY_MS);
    });
  }

  function Store() {
    this.values = {};
  }

  Store.prototype.insert = function(key, value) {
    var self = this;

    return delay(function() {
      self.values[key] = value;
    });
  };

  Store.prototype.get = function(key) {
    var self = this;

    return delay(function() {
      return self.values[key];
    });
  };

  Store.prototype.clear = function() {
    var self = this;

    return delay(function() {
      self.values = {};
    });
  };

  return Store;
});