
/**
 * prim 0.0.0 Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/prim for details
 */

/*global process, setTimeout, define, module */

//Set prime.hideResolutionConflict = true to allow "resolution-races"
//in promise-tests to pass.
//Since the goal of prim is to be a small impl for trusted code, it is
//more important to normally throw in this case so that we can find
//logic errors quicker.

var prim;
(function () {
    'use strict';
    var op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function check(p) {
        if (hasProp(p, 'e') || hasProp(p, 'v')) {
            if (!prim.hideResolutionConflict) {
                throw new Error('nope');
            }
            return false;
        }
        return true;
    }

    function notify(ary, value) {
        prim.nextTick(function () {
            each(ary, function (item) {
                item(value);
            });
        });
    }

    prim = function prim(yes, no) {
        var p,
            ok = yes ? [yes] : [],
            fail = no ? [no] : [];

        return (p = {
            callback: function (yes, no) {
                if (no) {
                    p.errback(no);
                }

                if (hasProp(p, 'v')) {
                    prim.nextTick(function () {
                        yes(p.v);
                    });
                } else {
                    ok.push(yes);
                }
            },

            errback: function (no) {
                if (hasProp(p, 'e')) {
                    prim.nextTick(function () {
                        no(p.e);
                    });
                } else {
                    fail.push(no);
                }
            },

            then: function (yes, no) {
                var next = prim();

                p.callback(function (v) {
                    var err;

                    try {
                        v = yes ? yes(v) : v;
                    } catch (e) {
                        err = e;
                        next.reject(err);
                    }

                    if (!err) {
                        if (v && v.then) {
                            v.then(next.resolve, next.reject);
                        } else {
                            next.resolve(v);
                        }
                    }
                }, function (e) {
                    var err;

                    try {
                        err = no && no(e);

                        if (!err) {
                            next.reject(e);
                        } else if (err instanceof Error) {
                            next.reject(err);
                        } else {
                            if (err && err.then) {
                                err.then(next.resolve, next.reject);
                            } else {
                                next.resolve(err);
                            }
                        }
                    } catch (noErr) {
                        next.reject(noErr);
                    }
                });

                return next;
            },

            resolve: function (v) {
                if (check(p)) {
                    p.v = v;
                    notify(ok, v);
                }
            },
            reject: function (e) {
                if (check(p)) {
                    p.e = e;
                    notify(fail, e);
                }
            }
        });
    };

    prim.nextTick = typeof process !== 'undefined' && process.nextTick ?
            process.nextTick : (typeof setTimeout !== 'undefined' ?
                function (fn) {
                setTimeout(fn, 0);
            } : function (fn) {
        fn();
    });

    if (typeof define === 'function' && define.amd) {
        define(function () { return prim; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = prim;
    }
}());
