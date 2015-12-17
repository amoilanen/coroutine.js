function evaluateIterator(iter, isDone=false, currentValue) {
  if (!isDone) {
    var {value, done} = iter.next(currentValue);

    return Promise.resolve(value).then((nextCurrentValue) =>
      evaluateIterator(iter, done, nextCurrentValue)
    );
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

function coroutine(func, ...args) {
  try {
    return Promise.resolve(evaluate(func, args));
  } catch(e) {
    return Promise.reject(e);
  }
}

export default coroutine