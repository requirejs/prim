A substandard promise library for use in requirejs code. If you are looking
for a promise library, consider [Q](https://github.com/kriskowal/q) instead.
This project is not for you.

## Motivation

This differs from a good standard promise library in the following ways.

### Sync

Allows sync promise resolution if prim.nextTick is set to a function
that immediately calls its argument. By default, it will try to use
setImmediate, process.nextTick or setTimeout though.

Sync resolution is normally a very bad idea. You should not look for this in a
promise library. However, r.js has some use cases in where
it has traditionally worked synchronously. With this option, the code can be
updated once and hopefully work async or sync by flipping a function switch.

### Trusted code

This code will take shortcuts by assuming the code producing and consuming
the promises trust each other. `prim.hideResolutionConflict` can be set to
true to allow the "resolution-races" promise-tests to pass. However the default
is to throw if a deferred tries to get resolved/rejected twice in a row, to help
debugging code.

### Size

The goal is to get a small promise implementation that may also someday be
used inside require.js itself. It may not make sense for require.js to use
it though. r.js will use it first, and its usefulness will be evaluated
on an ongoing basis.

## API

Hey, this code is not for you! Seriously, go use Q instead. Some notes so I
do not forget:

```javascript

var d = prim();
//d has the following methods:
//d.resolve(): pass a value to resolve to resolve the promise
//d.reject(): pass a value to reject to reject the promise
//d.promise: the promise object that only has .then(), .fail() and .end()

prim().start(function () {
    //Return a value to use as the resolved value.
    //Can be another promise.
}).then(function onResolved(value) {}, function onRejected(err) {});

```

## Tests

prim uses
[promises-aplus-tests](https://github.com/promises-aplus/promises-tests) as the
baseline tests to check if it is working like a promise library. It currently
passes version 1.2.1 of those tests, the latest version as of this writing.

To get the tests to run, you need node installed:

    cd tests
    npm install promises-aplus-tests
    ./runTests.sh

## License

MIT or new BSD.
