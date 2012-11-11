
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


var p = prim();

    p.then(function (a) {
        return b;
    }).then(function (b) {
        return c;
    })
    .fail()

    prim = function prim(yes, no) {
        var p,
            endFail = false,
            ok = yes ? [yes] : [],
            fail = no ? [no] : [];

        return (p = {
            then: function (yes, no) {
//Need to return new promise, but need to also have that promise
//use the yes function's return value as its resolution (same for no),
//and only called after resolution of this promise.
//ALSO: need to handle case where return value is a promise. Call then()
//on it if it has a .then

                var next = prim(yes, no);

                listen(p, ok, yes, 'v');
                listen(p, fail, no, 'e');
            },
            fail: function (no) {
                listen(p, fail, no, 'e');
                endFail = true;
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
                if (!fail.length && endFail) {
                    throw e;
                }
            },
            end: function () {
                //? how to know that no one already handled the error?
                if (hasProp(p, e) && !fail.length) {

                }
            }
        });
    };

    prim.nextTick = function (fn) {
        fn();
    };
}());
