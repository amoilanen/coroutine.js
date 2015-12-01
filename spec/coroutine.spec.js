import {coroutine} from './coroutine'

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

    it('should pass arguments to function', (done) => {
      coroutine((x, y, z) => {
        expect([x, y, z]).toEqual([1, 2, 3]);
        done();
      }, 1, 2, 3);
    });

    //TODO: Should pass arguments to function
    //TODO: Should return function return value
    //TODO: Should call the function in the containing context
  });
});