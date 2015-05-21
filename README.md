# mongoose-erase
[![Build Status](https://travis-ci.org/paperhive/mongoose-erase.svg)](https://travis-ci.org/paperhive/mongoose-erase) [![Coverage Status](https://coveralls.io/repos/paperhive/mongoose-erase/badge.svg?branch=master)](https://coveralls.io/r/paperhive/mongoose-erase?branch=master) [![Dependency Status](https://gemnasium.com/paperhive/mongoose-erase.svg)](https://gemnasium.com/paperhive/mongoose-erase)

[![NPM](https://nodei.co/npm/mongoose-erase.png?downloads=true)](https://nodei.co/npm/mongoose-erase/)

Erase collections, models and schemas for unit testing with mongoose

# Usage
With `mocha`, a unit test code that wipes the database before each test could look like this:
```javascript
var mongoose = require('mongoose');
var async = require('async');
var erase = require('mongoose-erase');

describe('yourFunction()', function() {

  beforeEach(function(done) {
    async.series([
      // connect (if not yet done)
      function(cb) {
        if (mongoose.connection.db) return cb();
        mongoose.connect('mongodb://localhost/test', cb);
      },
      // erase
      function (cb) {
        erase(mongoose, cb);
      }
    ], done);
  });

  it('should do something', function() {});

});
```
