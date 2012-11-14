"use strict";

var prim = require('../prim');

//Set this to true, to allow the resolution-races tests to pass.
prim.hideResolutionConflict = true;

exports.fulfilled = function (val) {
    var p = prim();
    p.resolve(val);
    return p.promise;
};

exports.rejected = function (err) {
    var p = prim();
    p.reject(err);
    return p.promise;
};

exports.pending = function () {
    var p = prim();

    return {
        promise: p.promise,
        fulfill: p.resolve,
        reject: p.reject
    };
};