function coroutine(func) {
  var args = [].slice.call(arguments, 1);

  func.apply(this, args);
}

export {coroutine};