/*jslint node: true */
"use strict";

var prim = require('../prim');

exports.resolved = function (value) {
    return prim.resolve(value);
};

exports.rejected = function (reason) {
    return prim.reject(reason);
};

exports.deferred = function () {
    var resolve, reject,
        promise = prim(function (res, rej) {
            resolve = res;
            reject = rej;
        });

    return {
        promise: promise,
        resolve: resolve,
        reject: reject
    };
};