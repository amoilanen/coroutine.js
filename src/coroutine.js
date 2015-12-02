function coroutine(func, ...args) {
  return Promise.resolve(func.apply(this, args));
}

export default coroutine