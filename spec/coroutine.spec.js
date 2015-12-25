import coroutine from './coroutine'

describe('coroutine', () => {

  it('should be defined', () => {
    expect(coroutine).toBeDefined();
  });

  describe('function argument', () => {

    it('executes function', () => {
      var executedFunction = false;

      coroutine(() =>
        executedFunction = true
      );
      expect(executedFunction).toBe(true);
    });

    it('passes arguments to function', () => {
      coroutine((x, y, z) =>
        expect([x, y, z]).toEqual([1, 2, 3])
      , 1, 2, 3);
    });

    it('immediately executes function in the correct context', () => {
      var context = {
        value: 'valueInContext'
      };

      //() => {} would ignore the context, using 'function'
      coroutine.call(context, function() {
        expect(this.value).toBe('valueInContext');
      });
    });

    it('returns promise that immediately resolves to function\'s return value', (done) => {
      coroutine(() => 'returnValue').then(value => {
        expect(value).toBe('returnValue');
        done();
      });
    });

    it('returns promise that rejects if the function throws an exception', (done) => {
      coroutine(() => {
        throw 'someError'
      }).catch(error => {
        expect(error).toBe('someError');
        done();
      });
    });

    it('returns a promise chained to the promise returned by the function if it returns a promise', (done) => {
      coroutine(() =>
        Promise.resolve('someValue')
      ).then(value => {
        expect(value).toBe('someValue');
        done();
      });
    });
  });

  describe('non-function argument', () => {

    it('resolves to the argument', () => {
      coroutine(1).then(value =>
        expect(value).toBe(1)
      );
    });
  });

  describe('generator argument', () => {

    describe('yields simple values', () => {

      describe('no yields', () => {

        it('executes the generator until it stops', (done) => {
          coroutine(function*() {
            return 'returnValue';
          }).then(value => {
            expect(value).toBe('returnValue');
            done();
          });
        });
      });

      describe('has yields', function() {

        it('executes the generator until it stops', (done) => {
          var iterationsCount = 0;

          coroutine(function*() {
            iterationsCount++;
            yield 'a';
            iterationsCount++;
            yield 'b';
            iterationsCount++;
            return 'c';
          }).then(value => {
            expect(value).toBe('c');
            expect(iterationsCount).toBe(3);
            done();
          });
        });

        it('rejects if the generator throws an exception', (done) => {
          coroutine(function*() {
            yield 'a';
            throw 'someError';
          }).catch(error => {
            expect(error).toBe('someError');
            done();
          });
        });

        it('executes generator with single yield', (done) => {
          coroutine(function*() {
            yield 'a';
          }).then(value => {
            expect(value).not.toBeDefined();
            done();
          });
        });
      });
    });

    it('passes arguments to the generator', (done) => {
      coroutine(function*(x, y, z) {
        return x + y + z;
      }, 'a', 'b', 'c').then(value => {
        expect(value).toBe('abc');
        done();
      });
    });

    describe('yields promises', () => {

      function neverResolve() {
        return new Promise((resolve, reject) => {})
      }

      function asyncResolveTo(value) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(value);
          }, 50);
        });
      }

      function asyncRejectTo(error) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(error);
          }, 50);
        });
      }

      it('awaits the promises that are yielded', (done) => {
        var iterationsCount = 0;

        coroutine(function*() {
          iterationsCount++;
          yield asyncResolveTo('a');
          iterationsCount++;
          yield asyncResolveTo('b');
          iterationsCount++;
          return asyncResolveTo('c');
        }).then(value => {
          expect(value).toBe('c');
          expect(iterationsCount).toBe(3);
          done();
        });
      });

      it('returns previous promise return value from yield', (done) => {
        coroutine(function*() {
          var x = yield asyncResolveTo('a');
          var y = yield asyncResolveTo('b');
          var z = yield asyncResolveTo('c');
          return x + y + z;
        }).then(value => {
          expect(value).toBe('abc');
          done();
        });
      });

      it('rejects if one of the promises rejects', (done) => {
        var iterationsCount = 0;

        coroutine(function*() {
          iterationsCount++;
          yield asyncResolveTo('a');
          iterationsCount++;
          yield asyncRejectTo('someError');
          iterationsCount++;
          return asyncResolveTo('c');
        }).catch(error => {
          expect(error).toBe('someError');
          expect(iterationsCount).toBe(2);
          done();
        });
      });

      it('returns promise return value for single yield in return', (done) => {
        var iterationsCount = 0;

        coroutine(function*() {
          return asyncResolveTo('a');
        }).then(value => {
          expect(value).toBe('a');
          done();
        });
      });

      it('is never settled if one of yielded promises is never settled', (done) => {
        var timeoutMs = 100;
        var hasResolved = false;
        var hasRejected = false;

        coroutine(function*() {
          yield neverResolve();
        }).then(value => {
          hasResolved = true;
        }).catch(error => {
          hasRejected = true;
        });
        setTimeout(() => {
          expect(hasResolved || hasRejected).toBe(false);
          done();
        }, timeoutMs);
      });
    });

    xdescribe('yielding to another generator', () => {
    });
  });
});