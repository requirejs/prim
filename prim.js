/*global process, setTimeout, define, module */

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
            throw new Error('nope');
        }
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

                if (hasProp('v')) {
                    prim.nextTick(function () {
                        yes(p.v);
                    });
                } else {
                    ok.push(yes);
                }
            },

            errback: function (no) {
                if (hasProp('e')) {
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
                    v = yes(v);
                    if (v.then) {
                        v.then(next.resolve, next.reject);
                    } else {
                        next.resolve(v);
                    }
                }, no);

                return next;
            },

            fail: function (no) {
                p.errback(no);
            },
            resolve: function (v) {
                check(v);
                p.v = v;
                notify(ok, v);
            },
            reject: function (e) {
                check(e);
                p.e = e;
                notify(fail, e);
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
