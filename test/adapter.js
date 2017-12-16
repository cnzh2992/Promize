'use strict';

const Promise = process.env.JSCOV
  ? require('../lib-cov/promize')
  : require('../src/promize');

module.exports = {
  deferred() {
    var defer = {};
    defer.promise = new Promise(function(resolve, reject) {
      defer.resolve = resolve;
      return (defer.reject = reject);
    });
    return defer;
  }
};
