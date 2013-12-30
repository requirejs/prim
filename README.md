A promise library for use in requirejs-related projects. If you are looking
for a robust promise library, consider [Q](https://github.com/kriskowal/q)
instead.

prim passes version 2.0.3 of the
[promises-aplus-tests](https://github.com/promises-aplus/promises-tests) as the
baseline tests to check if it is working like a promise library.

## Motivation

This differs from a a more robust standard promise library in the following
ways.

### Minimum bar

This library just wants a minimum implementation that passes the standard tests.
The hope is that over time, requirejs-related code that uses this library can
just remove it and use promises provided by the JS language.

### Sync

Allows sync promise resolution if `prim.nextTick` is set to a function
that immediately calls its argument. By default, it will try to use
setImmediate, process.nextTick or setTimeout though.

Sync resolution is normally a very bad idea. You should not look for this in a
promise library. However, r.js has some use cases in where
it has traditionally worked synchronously, Node's sync module system being the
main one. This override behavior allows that to work.

## API

This module works as an AMD or Node module.

It should conform to the basic Promises API. You can alias the export value of
the prim module to `Promise` if you want to write the code assuming promises
will be available in the language at some point:

```javascript
var Promise = require('prim');

var p = new Promise(function (resolve, reject) {
    // Call resolve(value) to resolve the promise to a value.
    // Call reject(Error) to resolve the promise to an error.
});

p.then(function (value) {
    console.log('Promise p has value: ' + value;)
}, function (error) {
    console.log('Promise p has error: ' + error);
});
```

Passing `new` is not required to create a new promise, prim will do the right
thing even without `new`. So, this is fine:

```javascript
var prim = require('prim');
var p = prim(function (resolve, reject) { });
```

`catch` can be used as a shorthand to just listening for a rejection:

```javascript
var p = new Promise(function (resolve, reject) {
    // Call reject(Error) to resolve the promise to an error.
});

// same as p.then(null, function (error) {});
p.catch(function (error) {
    console.log('Promise p has error: ' + error);
});
```

`all` is also available: it takes an array of promises and waits for them all
to be fulfilled, and resolves the all promise with an array of the results:

```javascript
prim.all([promise1, promise2]).then(function(values))
// same as p.then(null, function (error) {});
p.catch(function (error) {
    console.log('Promise p has error: ' + error);
});
```

Right now `all` only supports arrays, not any iterable.

## Tests

To get the tests to run, you need node installed, along with the promises-aplus
test suite:

    cd tests
    npm install promises-aplus-tests mocha
    ./runTests.sh

## License

MIT or new BSD.
