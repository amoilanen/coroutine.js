var coroutine = require('coroutine.js').default;

var values = {
  'a': 1,
  'b': 2,
  'c': 3
};

function defer(func) {
  setTimeout(func, 100);
}

function get(key) {
  return new Promise(function(resolve, reject) {
    defer(() => {
      resolve(values[key]);
    });
  });
}

coroutine(function* () {
  var x = yield get('a');
  var y = yield get('b');

  return x + y + (yield get('c'));
}).then((sumOfValues) => {
  console.log(sumOfValues);
});