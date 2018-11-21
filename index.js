module.exports = (total, done) => {
  if (!total || isNaN(total) || total < 1 || total >= Infinity) {
    throw new Error('Need a number between 1 and Infinity');
  }

  let counter = 0;
  let doneCalled = false;
  const lastCallResults = [];

  return async (error) => {
    counter++;
    if (typeof error === 'function') try {
      const fn = error;
      error = null;
      const callResult = await fn(...lastCallResults);
      lastCallResults.unshift(callResult);
    } catch (e) {
      error = e;
    }
    if (error) {
      done(error);
    } else if (counter > total) {
      done(new Error(`Assertion counter called ${counter - total} too many times (${counter}/${total})`));
    } else if (counter === total && !doneCalled) {
      doneCalled = true;
      done();
    }
  }
}
