import { promisify } from 'bluebird';
import co from 'co';
import mongoose from 'mongoose';

import { connect, connectAndErase, erase } from '../src';

const dbURI = 'mongodb://localhost/test';

// generator/yield-version of the async/await-based mochaAsync
function mochaAsync(fn) {
  return function (done) {
    const ctx = this;
    co(function* () {
      yield fn(ctx);
    }).then(done, done);
  };
}

describe('erase()', () => {
  before(mochaAsync(function* () {
    yield connectAndErase(mongoose, dbURI);

    const User = mongoose.model('User', new mongoose.Schema({
      name: {type: String, index: true},
    }));
    yield User.create({name: 'Darth'});

    yield erase(mongoose);
  }));

  it('should remove collections', mochaAsync(function* () {
    // get collections
    const collections = yield promisify(
      mongoose.connection.db.collections,
      {context: mongoose.connection.db}
    );

    // On older MongoDB installations, a collection "system.indexes" is
    // always present.
    if (collections.length > 0 &&
        collections[0].collectionName.match(/^system\./)) {
      collections.should.have.lengthOf(1);
    } else {
      collections.should.have.lengthOf(0);
    }
  }));

  it('should remove models', () => {
    (() => {
      mongoose.model('User');
    }).should.throw();
  });
});
