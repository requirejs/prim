/*jslint node: true */
"use strict";

var create = require('../prim').create,
    Prim = create({
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