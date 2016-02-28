import coroutine from './coroutine'

function defer(func) {
  setTimeout(func, 100);
}

function asyncResolveTo(value) {
  return new Promise(function(resolve, reject) {
    defer(() => {
      resolve(value);
    });
  });
}

describe('asynchronous data store', () => {

  class Store {

    constructor(items) {
      this.items = (items instanceof Array) ? items.slice() : [];
    }

    insert(item, callback) {
      defer(() => {
        this.items.push(item);
        callback();
      });
    }

    find(callback) {
      defer(() => {
        callback(this.items);
      });
    }
  }

  var store;
  var initialItems = [1, 2];
  var newItem = 3;

  beforeEach(() => {
    store = new Store(initialItems);
  });

  describe('callbacks', () => {

    it('can use store', (done) => {
      store.insert(newItem, () => {
        store.find((items) => {
          expect(items).toEqual(initialItems.concat(newItem));
          done();
        });
      });
    });
  });
});

describe('multiple data requests', () => {

  var news = 'News of the day';

  var ads = ['Buy this shiny new device', 'Eat in this nice cafe', 'Register for a free webinar'];

  var weather = 'Quite cold';

  var message = 'Hi, everybody!';

  var postedMessages;

  beforeEach(() => {
    postedMessages = [];
  });

  function expectReceivingProperValues() {
    expect(receivedNews).toEqual(news);
    expect(receivedAds).toEqual(ads);
    expect(receivedWeather).toEqual(weather);
    expect(postedMessages).toEqual([message]);
  }

  describe('callbacks', () => {

    function getNews(callback) {
      defer(() => callback(news));
    }

    function getAds(callback) {
      defer(() => callback(ads));
    }

    function getWeather(callback) {
      defer(() => callback(weather));
    }

    function postMessage(msg, callback) {
      defer(() => {
        postedMessages.push(msg);
        callback();
      })
    }

    it('should be able to post message after viewing news, ads, and weather', (done) => {
      getNews((receivedNews) => {
        getAds((receivedAds) => {
          getWeather((receivedWeather) => {
            postMessage(message, () => {
              expect(receivedNews).toEqual(news);
              expect(receivedAds).toEqual(ads);
              expect(receivedWeather).toEqual(weather);
              expect(postedMessages).toEqual([message]);
              done();
            });
          });
        });
      });
    });
  });

  describe('no callbacks', () => {

    function getNews() {
      return asyncResolveTo(news);
    }

    function getAds() {
      return asyncResolveTo(ads);
    }

    function getWeather() {
      return asyncResolveTo(weather);
    }

    function postMessage(msg, callback) {
      return new Promise((resolve, reject) => {
        defer(() => {
          postedMessages.push(msg);
          resolve();
        });
      });
    }

    describe('pure promises', () => {

      it('should be able to post message after viewing news, ads, and weather', (done) => {
        var receivedNews;
        var receivedAds;
        var receivedWeather;

        getNews().then((news) => {
          receivedNews = news;
          return getAds();
        }).then((ads) => {
          receivedAds = ads;
          return getWeather();
        }).then((weather) => {
          receivedWeather = weather;
          return postMessage(message);
        }).then(() => {
          expect(receivedNews).toEqual(news);
          expect(receivedAds).toEqual(ads);
          expect(receivedWeather).toEqual(weather);
          expect(postedMessages).toEqual([message]);
          done();
        });
      });
    });

    describe('coroutine', () => {

      it('should be able to post message after viewing news, ads, and weather', (done) => {
        var receivedNews;
        var receivedAds;
        var receivedWeather;

        coroutine(function*() {
          var receivedNews = yield getNews();
          var receivedAds = yield getAds();
          var receivedWeather = yield getWeather();

          yield postMessage(message);

          expect(receivedNews).toEqual(news);
          expect(receivedAds).toEqual(ads);
          expect(receivedWeather).toEqual(weather);
          expect(postedMessages).toEqual([message]);
          done();
        });
      });
    });
  });
});