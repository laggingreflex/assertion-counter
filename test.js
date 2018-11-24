const counter = require('.');
const assert = require('assert');

describe('basic', () => {
  it('requires a number', () => {
    assert.throws(() => {
      counter()
    })
  })
});

describe('done', () => {
  it('1', (done) => {
    const count = counter(1, done);
    count();
  });
  it('2', (done) => {
    const count = counter(2, done);
    count();
    setTimeout(() => count());
  });
  describe('error', () => {
    it('throw', (done) => {
      const count = counter(1, error => {
        done(assert(error instanceof Error));
      });
      count(new Error);
    });
    it('over count', (done) => {
      let _counter = 2
      const count = counter(1, error => {
        if (--_counter === 0) {
          done(assert(error instanceof Error))
        }
      });
      count();
      count();
    });
  })
});

describe('promise', () => {
  it('1', () => {
    const count = counter(1);
    count();
    return count.promise
  });
  it('2', () => {
    const count = counter(2);
    count();
    setTimeout(() => count());
    return count.promise;
  });
  describe('error', () => {
    it('throw', () => {
      return assert.throws(() => {
        const count = counter(1);
        count(new Error);
        return count.promise;
      });
    });
    it.skip('over count // cannot reject a promise once resolved', () => {
      return assert.rejects(() => {
        const count = counter(1);
        count();
        count();
        return count.promise;
      });
    });
  })
});


describe('fn', () => {
  describe('done', () => {
    it('1', (done) => {
      const count = counter(1, done);
      count(() => {});
    });
    it('2', (done) => {
      const count = counter(2, done);
      count(() => {});
      setTimeout(() => count(() => {}));
    });
    describe('error', () => {
      it('throw', (done) => {
        const count = counter(2, error => {
          done(assert(error instanceof Error));
        });
        count(() => { throw new Error });
      });
      it('over count', (done) => {
        let _counter = 2
        const count = counter(1, error => {
          if (--_counter === 0) {
            done(assert(error instanceof Error))
          }
        });
        count(() => {});
        count(() => {});
      });
    });
    describe('callResult', () => {
      it('sync', (done) => {
        const count = counter(2, done);
        const callResult = [];
        const a = 'a';
        const b = 'b';
        callResult[0] = count(() => { return a });
        callResult[1] = count((i) => { assert.equal(i, a); return b });
        assert.deepEqual(callResult, [a, b]);
      });
      it('async', (done) => {
        (async () => {
          const count = counter(2, done);
          const callResult = [];
          const a = 'a';
          const b = 'b';
          callResult[0] = await count(async () => { return a });
          callResult[1] = await count(async (i) => { assert.equal(i, a); return b });
          assert.deepEqual(callResult, [a, b]);
        })();
      });
    })
  });

  describe('promise', () => {
    it('1', () => {
      const count = counter(1);
      count(() => {});
      return count.promise;
    });
    it('2', () => {
      const count = counter(2);
      count(() => {});
      setTimeout(() => count(() => {}));
      return count.promise
    });
    describe('error', () => {
      it('throw', () => {
        return assert.throws(() => {
          const count = counter(2);
          count(() => { throw new Error });
          return count.promise;
        });
      });
    });
    describe('callResult', () => {
      it('sync', () => {
        const count = counter(2);
        const callResult = [];
        const a = 'a';
        const b = 'b';
        callResult[0] = count(() => { return a });
        callResult[1] = count((i) => { assert.equal(i, a); return b });
        assert.deepEqual(callResult, [a, b]);
        return count.promise;
      });
      it('async', async () => {
        const count = counter(2);
        const callResult = [];
        const a = 'a';
        const b = 'b';
        callResult[0] = await count(async () => { return a });
        callResult[1] = await count(async (i) => { assert.equal(i, a); return b });
        assert.deepEqual(callResult, [a, b]);
        return count.promise;
      });
    })
  });

});
