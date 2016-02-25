'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.coroutine = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function evaluateIterator(iter) {
    var isDone = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var currentValue = arguments[2];

    if (!isDone) {
      var _iter$next = iter.next(currentValue);

      var value = _iter$next.value;
      var done = _iter$next.done;
      return Promise.resolve(value).then(function (resolvedValue) {
        return evaluateIterator(iter, done, resolvedValue);
      });
    } else {
      return currentValue;
    }
  }

  function evaluate(func, args) {
    if (func.constructor.name === 'GeneratorFunction') {
      return evaluateIterator(func.apply(this, args));
    } else if (typeof func === 'function') {
      return func.apply(this, args);
    } else {
      return func;
    }
  }

  function coroutine(func) {
    try {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return Promise.resolve(evaluate(func, args));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  exports.default = coroutine;
});