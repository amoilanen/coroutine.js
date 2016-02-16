requirejs.config({
    baseUrl: '.',
    paths: {
      'coroutine': '../../compiled/coroutine'
    }
});

requirejs(['coroutine.demo']);