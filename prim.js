/**
 * Prim 0.0.4+ Copyright (c) 2012-2013, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/prim for details
 */

/*global setImmediate, process, setTimeout, define, module */

//Set Prim.hideResolutionConflict = true to allow "resolution-races"
//in promise-tests to pass.
//Since the goal of Prim is to be a small impl for trusted code, it is
//more important to normally throw in this case so that we can find
//logic errors quicker.

var Prim;
(function () {
    'use strict';

    function syncTick(fn) {
        fn();
    }

    function make(options) {
        options = options || {};

        var waitingId, Inst, nextTick,
            waiting = [];

        function callWaiting() {
            try {
                while (waiting.length) {
                    waiting.shift()();
                }
            } finally {
                waitingId = 0;
            }
        }

        function asyncTick(fn) {
            waiting.push(fn);
            if (!waitingId) {
                waitingId = setTimeout(callWaiting, 0);
            }
        }

        if (options.sync) {
            nextTick = syncTick;
        } else {
            //Use setImmediate.bind() because attaching it (or setTimeout directly
            //to Prim will result in errors. Noticed first on IE10,
            //issue requirejs/alameda#2)
            nextTick = typeof setImmediate === 'function' ? setImmediate.bind() :
                (typeof process !== 'undefined' && process.nextTick ?
                    process.nextTick : (typeof setTimeout !== 'undefined' ?
                        asyncTick : syncTick));
        }

        function notify(ary, value) {
            Inst.nextTick(function () {
                ary.forEach(function (item) {
                    item(value);
                });
            });
        }

        function callback(p, ok, yes) {
            if (p.hasOwnProperty('v')) {
                Inst.nextTick(function () {
                    yes(p.v);
                });
            } else {
                ok.push(yes);
            }
        }

        function errback(p, fail, no) {
            if (p.hasOwnProperty('e')) {
                Inst.nextTick(function () {
                    no(p.e);
                });
            } else {
                fail.push(no);
            }
        }

        Inst = function Prim(fn) {
            var promise, f,
                p = {},
                ok = [],
                fail = [];

            function makeFulfill() {
                var f, f2,
                    called = false;

                function fulfill(v, prop, listeners) {
                    if (called) {
                        if (!options.hideResolutionConflict) {
                            throw new Error('duplicate fulfillment call');
                        }
                        return;
                    }
                    called = true;

                    if (promise === v) {
                        called = false;
                        f.reject(new TypeError('value is same promise'));
                        return;
                    }

                    try {
                        var then = v && v.then,
                            type = typeof v;
                        if ((type === 'object' || type === 'function') &&
                            typeof then === 'function') {
                            f2 = makeFulfill();
                            then.call(v, f2.resolve, f2.reject);
                        } else {
                            p[prop] = v;
                            notify(listeners, v);
                        }
                    } catch (e) {
                        called = false;
                        f.reject(e);
                    }
                }

                f = {
                    resolve: function (v) {
                        fulfill(v, 'v', ok);
                    },
                    reject: function(e) {
                        fulfill(e, 'e', fail);
                    }
                };
                return f;
            }

            f = makeFulfill();

            promise = {
                then: function (yes, no) {
                    var next = new Inst(function (nextResolve, nextReject) {

                        function finish(fn, nextFn, v) {
                            try {
                                if (fn && typeof fn === 'function') {
                                    v = fn(v);
                                    nextResolve(v);
                                } else {
                                    nextFn(v);
                                }
                            } catch (e) {
                                nextReject(e);
                            }
                        }

                        callback(p, ok, finish.bind(undefined, yes, nextResolve));
                        errback(p, fail, finish.bind(undefined, no, nextReject));

                    });
                    return next;
                },

                catch: function (no) {
                    return promise.then(null, no);
                }
            };

            try {
                fn(f.resolve, f.reject);
            } catch (e) {
                f.reject(e);
            }

            return promise;
        };

        Inst.resolve = function (value) {
            return new Inst(function (yes) {
                yes(value);
            });
        };

        Inst.reject = function (err) {
            return new Inst(function (yes, no) {
                no(err);
            });
        };

        // TODO: Promise.cast, Promise.all
        // https://github.com/domenic/promises-unwrapping/blob/master/README.md#promiseall--iterable-

        // TODO: remove?
        Inst.serial = function (ary) {
            var result = Inst.resolve();
            ary.forEach(function (item) {
                result = result.then(function () {
                    return item();
                });
            });
            return result;
        };

        Inst.nextTick = nextTick;

        return Inst;
    }

    Prim = make();
    Prim.make = make;

    if (typeof define === 'function' && define.amd) {
        define(function () { return Prim; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Prim;
    }
}());
