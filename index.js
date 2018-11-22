module.exports = (total, _done) => {
  if (!total || isNaN(total) || total < 1 || total >= Infinity) {
    throw new Error('Need a number between 1 and Infinity');
  }

  if (!_done) {
    count.promise = new Promise((resolve, reject) => {
      _done = error => error ? reject(error) : resolve();
    });
  }

  let counter = 0;
  const lastCallResults = [];

  let doneCalled;
  const done = e => {
    // console.log(`done called`, { counter, total, e });
    counter++
    if (e) {
      return _done(e);
    } else if (counter > total) {
      _done(new Error(`Counter called too many times (${counter}/${total})`));
    } else if (counter === total && !doneCalled) {
      doneCalled = true;
      return _done();
    }
  };

  function count(fn) {
    // console.log(`count called`, { counter, total, fn });
    if (typeof fn !== 'function') {
      return done(fn);
    }

    try {
      const callResult = fn(...lastCallResults);
      lastCallResults.unshift(callResult);
      if (callResult && callResult.then) {
        return callResult.then(callResult => {
          lastCallResults.unshift(callResult);
          done();
          return callResult;
        }).catch(done)
      } else {
        done();
        return callResult;
      }
    } catch (error) {
      done(error);
    }
  }

  return count;
}
