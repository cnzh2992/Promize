'use strict';

const Promise = require('../src/promize');

module.exports = {
  deferred() {
    var defer = {};
    defer.promise = new Promise(function(resolve, reject) {
      defer.resolve = resolve;
      return (defer.reject = reject);
    });
    return defer;
  },
};
