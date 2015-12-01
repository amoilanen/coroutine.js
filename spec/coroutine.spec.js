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

    //TODO: Should pass arguments to function
    //TODO: Should return function return value
  });
});