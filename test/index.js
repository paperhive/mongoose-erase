const dbURI = 'mongodb://localhost/mongoose-erase';
const mongoose = require('mongoose');
const async = require('async');

const erase = require('../');

describe('erase()', () => {
  before((done) => {
    async.series([
      // make sure that database is connected and erase it
      erase.connectAndErase(mongoose, dbURI),
      // add collection users
      (cb) => {
        const User = mongoose.model('User', new mongoose.Schema({
          name: {type: String, index: true},
        }));
        User.create({name: 'Darth'}, cb);
      },
      // erase
      (cb) => {
        erase.erase(mongoose, cb);
      },
    ], done);
  });

  it('should remove collections', function assertDeletion(done) {
    mongoose.connection.db.collections((err, collections) => {
      if (err) {return done(err);}
      // On older MongoDB installations, a collection "system.indexes" is
      // always present.
      if (collections.length > 0 &&
        collections[0].collectionName.match(/^system\./)) {
        collections.should.have.lengthOf(1);
      } else {
        collections.should.have.lengthOf(0);
      }
      done();
    });
  });

  it('should remove models', () => {
    (() => {
      mongoose.model('User');
    }).should.throw();
  });
});
