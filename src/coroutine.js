function coroutine(func, ...args) {
  return func.apply(this, args);
}

export default coroutine