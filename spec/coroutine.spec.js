import coroutine from './coroutine'

describe('coroutine', () => {

  it('should be defined', () => {
    expect(coroutine).toBeDefined();
  });

  describe('function argument', () => {

    it('should execute function', () => {
      var executedFunction = false;

      coroutine(() =>
        executedFunction = true
      );
      expect(executedFunction).toBe(true);
    });

    it('should pass arguments to function', () => {
      coroutine((x, y, z) =>
        expect([x, y, z]).toEqual([1, 2, 3])
      , 1, 2, 3);
    });

    it('should immediately execute function in the correct context', () => {
      var context = {
        value: 'valueInContext'
      };

      //() => {} would ignore the context, using 'function'
      coroutine.call(context, function() {
        expect(this.value).toBe('valueInContext');
      });
    });

    it('should return promise that immediately resolves to function\'s return value', (done) => {
      coroutine(() => 'returnValue').then(value => {
        expect(value).toBe('returnValue');
        done();
      });
    });

    it('should return promise that rejects if the function throws an exception', (done) => {
      coroutine(() => {
        throw 'someError'
      }).catch(error => {
        expect(error).toBe('someError');
        done();
      });
    });

    it('should return a promise chained to the promise returned by the function if it returns a promise', (done) => {
      coroutine(() =>
        Promise.resolve('someValue')
      ).then(value => {
        expect(value).toBe('someValue');
        done();
      });
    });
  });

  describe('non-function argument', () => {

    it('should resolve to the argument', () => {
      coroutine(1).then(value =>
        expect(value).toBe(1)
      );
    });
  });

  describe('generator argument', () => {

    describe('returns simple values', () => {

      describe('no yields', () => {

        it('executes the generator until it stops', (done) => {
          coroutine(function* oneStep() {
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

          coroutine(function* withYields() {
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

        //TODO: From a yield the value yielded is returned
      });

      //TODO: generator with several steps and arguments
    });

    //TODO: Awaits the promises that are yielded
    //TODO: One of the promises that are yielded rejects => whole coroutine rejects
    //TODO: If the value yielded is a promise the value to which it resolves is returned
    //TODO: Should pass argument values to the generator function
  });
});