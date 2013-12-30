/*jshint node: true */
/*global describe, it */

var prim = require('../../prim'),
    assert = require('assert');

describe('prim', function () {
    describe('#cast()', function () {
        function confirmOk(p, done, altValue) {
            p.then(function (v) {
                assert.equal(altValue || 'ok', v);
                done();
            }).catch(function (e) {
                console.log(e);
            });
        }

        it('existing promise', function (done) {
            confirmOk(prim.cast(prim(function (resolve) {
                resolve('ok');
            })), done);

        });

        it('string', function (done) {
            confirmOk(prim.cast('ok'), done);
        });

        it('number', function (done) {
            confirmOk(prim.cast(42), done, 42);
        });
    });

    describe('#all()', function () {
        var expected = [
            42,
            'ok'
        ];

        function confirmValues(values) {
            expected.forEach(function (expected, i) {
                assert.equal(expected, values[i]);
            });
        }

        it('promises', function (done) {
            prim.all(expected.map(function (value) {
                return prim.resolve(value);
            })).then(function (values) {
                confirmValues(values);
                done();
            }).catch(function (e) {
                console.log(e);
            });
        });

        it('raw values', function (done) {
            prim.all(expected).then(function (values) {
                confirmValues(values);
                done();
            }).catch(function (e) {
                console.log(e);
            });
        });

        it('a rejected promise', function (done) {
            prim.all(expected.map(function (value, i) {
                if (i === 0) {
                    return prim.reject(new TypeError('bad'));
                } else {
                    return value;
                }
            })).catch(function (e) {
                assert.equal(true, e instanceof Error);
                done();
            });
        });

        it('rejected from error object', function (done) {
            prim.all(expected.map(function (value, i) {
                if (i === 0) {
                    return new TypeError('bad');
                } else {
                    return value;
                }
            })).catch(function (e) {
                assert.equal(true, e instanceof Error);
                done();
            });
        });
    });
});
