function coroutine(func, ...args) {
  if (func.constructor.name === 'GeneratorFunction') {
    var iter = func.apply(this, args);
    var nextIter = {done: false};
    var value;

    while (!nextIter.done) {
      nextIter = iter.next();
      value = nextIter.value;
    }
    return Promise.resolve(value);
  } else if (typeof func === 'function') {
    try {
      return Promise.resolve(func.apply(this, args));
    } catch(e) {
      return Promise.reject(e);
    }
  } else {
    return Promise.resolve(func);
  }
}

export default coroutine