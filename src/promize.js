(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Promize = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  function settleHandler(self, handler) {
    switch (self.state) {
      case PENDING:
        self.handlers.push(handler);
        break;
      case FULFILLED:
        handler.onFulfill && handler.onFulfill(self.value);
        break;
      case REJECTED:
        handler.onReject && handler.onReject(self.value);
        break;
      default:
        return;
    }
  }

  function onFulfillPromise(self, value) {
    // 2.1.2
    self.state = FULFILLED;
    self.value = value;
    self.handlers.forEach(function(handler) {
      settleHandler(self, handler);
    });
    self.handlers = [];
  }

  function onRejectPromise(self, reason) {
    // 2.1.3
    self.state = REJECTED;
    self.value = reason;
    self.handlers.forEach(function(handler) {
      settleHandler(self, handler);
    });
    self.handlers = [];
  }

  function resolve(self, x) {
    // 2.1.2
    if (self.state !== PENDING) return;
    // 2.3.1
    if (self.instance === x) {
      reject(self, new TypeError('Chaining cycle detected for promise'));
      return;
    }

    var then,
      type = typeof x,
      called = false;
    // 2.3.3
    if (x !== null && (type === 'function' || type === 'object')) {
      try {
        // 2.3.3.1
        then = x.then;
        if (typeof then === 'function') {
          // 2.3.3.3
          then.call(
            x,
            function resolvePromise(y) {
              // 2.3.3.3.3
              if (called) return;
              called = true;
              // 2.3.3.3.1
              resolve(self, y);
            },
            function rejectPromise(r) {
              // 2.3.3.3.3
              if (called) return;
              called = true;
              // 2.3.3.3.2
              reject(self, r);
            }
          );
        } else {
          onFulfillPromise(self, x);
        }
      } catch (err) {
        // 2.3.3.3.4.1
        if (called) return;
        // 2.3.3.2 & 2.3.3.3.4.2
        reject(self, err);
      }
    } else {
      onFulfillPromise(self, x);
    }
  }

  function reject(self, r) {
    // 2.1.3
    if (self.state !== PENDING) return;
    onRejectPromise(self, r);
  }

  function then(self, onFulfilled, onRejected) {
    return new Promize(function(resolve, reject) {
      settleHandler(self, {
        onFulfill: function(value) {
          // 2.2.4
          setTimeout(function() {
            try {
              // 2.2.7.3
              var resolveValue =
                typeof onFulfilled === 'function' ? onFulfilled(value) : value;
            } catch (err) {
              // 2.2.7.2
              reject(err);
              return;
            }
            // 2.2.7.1
            resolve(resolveValue);
          });
        },
        onReject: function(reason) {
          // 2.2.4
          setTimeout(function() {
            if (typeof onRejected === 'function') {
              try {
                var rejectValue = onRejected(reason);
              } catch (err) {
                // 2.2.7.2
                reject(err);
              }
              // 2.2.7.1
              resolve(rejectValue);
            } else {
              // 2.2.7.4
              reject(reason);
            }
          });
        }
      });
    });
  }

  function Promize(resolver) {
    var self = {
      handlers: [],
      state: PENDING,
      value: void 0,
      instance: this
    };
    this.then = then.bind(null, self);

    if (typeof resolver !== 'function') {
      throw new TypeError(
        'Promise resolver ' + resolver + ' is not a function'
      );
    }

    resolver(resolve.bind(null, self), reject.bind(null, self));
  }

  return Promize;
});
