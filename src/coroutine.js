function evaluate(func, args) {
  if (func.constructor.name === 'GeneratorFunction') {
    var iter = func.apply(this, args);
    var nextIter = {done: false};
    var value;

    while (!nextIter.done) {
      nextIter = iter.next();
      value = nextIter.value;
    }
    return value;
  } else if (typeof func === 'function') {
    return func.apply(this, args);
  } else {
    return func;
  }
}

function coroutine(func, ...args) {
  try {
    return Promise.resolve(evaluate(func, args));
  } catch(e) {
    return Promise.reject(e);
  }
}

export default coroutine