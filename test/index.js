var dbURI = 'mongodb://localhost/mongoose-erase';
var mongoose = require('mongoose');
var async = require('async');
var should = require('should');

var erase = require('../');

describe('erase()', function() {

  before(function(done) {
    async.series([
      // make sure that database is connected
      function(cb) {
        if (mongoose.connection.db) {return cb();}
        mongoose.connect(dbURI, cb);
      },
      // add collection users
      function(cb) {
        var User = mongoose.model('User', new mongoose.Schema({
          name: {type: String, index: true}
        }));
        User.create({name: 'Darth'}, cb);
      },
      // erase
      function(cb) {
        erase(mongoose, cb);
      }
    ], done);
  });

  it('should remove collections', function(done) {
    mongoose.connection.db.collections(function(err, collections) {
      if (err) {return done(err);}
      collections.should.have.lengthOf(1);
      done();
    });
  });
});
