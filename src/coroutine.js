function coroutine(func) {
  var args = [].slice.call(arguments, 1);

  return func.apply(this, args);
}

export {coroutine};