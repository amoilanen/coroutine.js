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

    it('should pass arguments to function', done => {
      coroutine((x, y, z) => {
        expect([x, y, z]).toEqual([1, 2, 3]);
        done();
      }, 1, 2, 3);
    });

    it('should execute function in the correct context', done => {
      var context = {
        value: 'valueInContext'
      };

      //() => {} would ignore the context
      coroutine.call(context, function() {
        expect(this.value).toBe('valueInContext');
        done();
      });
    });

    it('should return promise that immediately resolves to function\'s return value', () => {
      coroutine(() => {
        return 'returnValue';
      }).then(value => {
        expect(value).toBe('returnValue');
      });
    });
  });
});