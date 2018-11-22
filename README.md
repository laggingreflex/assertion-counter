# assertion-counter

Assertion counter with some unique features.

## Install

```
npm i assertion-counter
```

## Usage

```js
const counter = require('assertion-counter')

it('should count assertions', (done) => {
  const ok = counter(5, done);
  // or without done
  const ok = counter(5); // then return ok.promise

  ok()

  // can take an error
  ok(new Error('not ok'))     // calls done(error)

  // can take a [async] function
  ok(async () => {
    throw new Error('not ok') // calls done(error)
  })

  const callMe = () => {
    // the function passes results from previous calls
    ok(...previousArgs => {
      assert.equal(previousArgs[0], 'ok')
    })                     │
  }                        │
                           │
  ok(() => {               │
    setTimeout(callMe);    │
    return 'ok' ───────────┘
  })

})
```
