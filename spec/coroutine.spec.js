import coroutine from './coroutine'

describe('coroutine', () => {

  it('should be defined', () => {
    expect(coroutine).toBeDefined();
  });

  describe('function argument', () => {

    it('should execute function', () => {
      var executedFunction = false;

      coroutine(() => {
        executedFunction = true;
      });
      expect(executedFunction).toBe(true);
    });

    it('should pass arguments to function', () => {
      coroutine((x, y, z) => {
        expect([x, y, z]).toEqual([1, 2, 3]);
      }, 1, 2, 3);
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

    it('should return promise that immediately resolves to function\'s return value', () => {
      coroutine(() => {
        return 'returnValue';
      }).then(value =>
        expect(value).toBe('returnValue')
      );
    });

    //TODO: Function throws an exception
    //TODO: Function returns a promise?
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

        it('executes the generator until it stops', function() {
          coroutine(function* oneStep() {
            return 'returnValue';
          }).then(value =>
            expect(value).toBe('returnValue')
          );
        });
      });

      xdescribe('several yields', function() {

        it('executes the generator until it stops', function() {
          coroutine(function* oneStep() {
            var x = yield 'a';
            var y = yield 'b';
            return 'c';
          }).then(value =>
            expect(value).toBe('c')
          );
        });
      });

      //TODO: generator with several steps and arguments
    });

    
    //TODO: Should pass values to the generator function
  });
});