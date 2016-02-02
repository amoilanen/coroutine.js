var coroutine = require('../../compiled/coroutine').default;
var request = require('request');

function get(url) {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
}

coroutine(function* (){
  var googleResponse = yield get('http://www.google.com');
  var yahooResponse = yield get('http://www.yahoo.com');
  var bingResponse = yield get('http://www.bing.com');

  return [googleResponse, yahooResponse, bingResponse].map(function(response) {
    return response.statusCode;
  });
}).then(function(statusCodes) {
  console.log('Received status codes = ', statusCodes);
});