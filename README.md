coroutine.js
==========

Co-routine implementation for JavaScript. More background https://en.wikipedia.org/wiki/Coroutine

Useful tool for asynchronous programming in case some functions are asynchronous and we have to wait for their completion before
proceeding further. Example below explains this in more detail.

For newer proposed versions of JavaScript checkout the async/await mechanism which is very similar to the present coroutine implementation https://jakearchibald.com/2014/es7-async-functions/

## Why

Asynchronous programming in JavaScript can be quite confusing and lead to code that is hard to understand and support.
Let's consider the case of interacting with some hypothetical data store via asynchronous method invocations.

### Callbacks

```javascript
  store.insert(newItem, () => {
    store.find(items => {
      //do something with items
    });
  });
```

When the store method completes its execution the callback passed as the last argument is invoked. In more complex examples we might end up with deeply nested structure in which it will be hard to track the order of execution and implement proper error handling, i.e. we will experience the well-known "callback hell" http://callbackhell.com/

Using callbacks in this manner provides a workaround for older JavaScript versions lacking language constructs that deal with asynchronous execution.

However, with modern JavaScript we can do better.

### Promises

Promises somewhat aleviate the pains of using callbacks by providing the asbtraction of asynchronous computation.

```javascript
  store.insert(newItem).then(() => {
    return store.find();
  }).then(items => {
    //do something with items
  });
```

Every store method now returns a promise https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise.
Promises can be chained to each other with using `then` and we can also handle errors in a more unified and orderly manner.

However the code still remains quite low-level and requires wrapping every invocation of an asynchronous method into quite wordy promise handling code.

We can still do better and write cleaner asynchronous code.

### Coroutines

The latest versions of JavaScript introduce generator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function* functions that allow to define a computation that can be suspended and resumed. From here there is one step to implementing the coroutine mechanism that the present library provides.

```javascript
  coroutine(function* () {
    yield store.insert(newItem);
    var items = yield store.find();

    //do something with items
  });
```

Store methods still return promises, and these are yielded https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield from the generator function to the coroutine implementation that waits for their completion and passes the results further the execution flow of the generator.

## Usage

In order to use the library require it in Node.js or import it as an AMD module with Require.js or import it globally. Examples can be found in the `examples` folder.

## Browser and JavaScript engine support

Target JavaScript engine has to support:

  - Generators, and yield keyword http://kangax.github.io/compat-table/es6/#test-generators
  - Promises http://caniuse.com/#search=promise

The library has been tested with:

Chrome 46.0.2490.86
Firefox 44.0

Node.js 5.0.0

## License

MIT License
(c) [Anton Ivanov](http://smthngsmwhr.wordpress.com/)