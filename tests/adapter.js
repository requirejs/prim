"use strict";

var prim = require('../prim');

//Set this to true, to allow the resolution-races tests to pass.
prim.hideResolutionConflict = true;

exports.fulfilled = function (val) {
    var p = prim();
    p.resolve(val);
    return p;
};

exports.rejected = function (err) {
    var p = prim();
    p.reject(err);
    return p;
};

exports.pending = function () {
    var p = prim();

    return {
        promise: p,
        fulfill: p.resolve,
        reject: p.reject
    };
};