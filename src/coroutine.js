function coroutine(func, ...args) {
  if (typeof func === 'function') {
    return Promise.resolve(func.apply(this, args));
  } else {
    return Promise.resolve(func);
  }
}

export default coroutine