"use strict";

var prim = require('../prim');

exports.fulfilled = function () {
    return prim();
};

exports.rejected = function () {
    return prim();
}


exports.pending = function () {
    var p = prim();

    return {
        promise: p,
        fulfill: p.resolve,
        reject: p.reject
    };
};