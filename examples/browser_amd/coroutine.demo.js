define(['coroutine', 'store'], function(coroutine, Store) {
  coroutine = coroutine.default;

  var s = new Store();

  coroutine(function* () {
    yield s.insert('counter', 1);
    yield s.insert('counter', 2);
    yield s.insert('counter', 3);

    var counter = yield s.get('counter');

    console.log("counter should be equal to 3 = ", counter);
  });
});