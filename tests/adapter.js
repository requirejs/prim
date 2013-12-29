/*jslint node: true */
"use strict";

var make = require('../prim').make,
    Prim = make({
        hideResolutionConflict: true
    });

exports.resolved = function (value) {
    return Prim.resolve(value);
};

exports.rejected = function (reason) {
    return Prim.reject(reason);
};

exports.deferred = function () {
    var resolve, reject,
        promise = new Prim(function (res, rej) {
            resolve = res;
            reject = rej;
        });

    return {
        promise: promise,
        resolve: resolve,
        reject: reject
    };
};