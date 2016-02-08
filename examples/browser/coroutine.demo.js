var coroutine = coroutine.default;

function get(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();

    request.open('GET', encodeURI(url));
    request.onload = function() {
      if (request.status === 200) {
        resolve(JSON.parse(request.responseText));
      } else {
        reject(request.status);
      }
    };
    request.send();
  });
}

var sources = ['1.json', '2.json', '3.json'];

coroutine(function*() {
  var toAssign = [];
  var sourceContents = sources.map(function* (source) {
    return yield get(source);
  });
  for (let sourceContent of sourceContents) {
    toAssign.push(yield* sourceContent);
  }
  return Object.assign.apply({}, toAssign);
}).then(function(value) {
  console.log('Combined value = ', value);
});